<?php

namespace App\Controller;

use App\Entity\Users;
use App\Entity\Articles;
use App\Entity\Images;
use App\Entity\MainTags;
use App\Entity\Tags;
use App\Entity\Reviews;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Constraints\IsNull;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class ArticlesController extends AbstractController
{
    /**
     *  @Route("/articles", name="articles", methods={"GET"})
     *
     */
    public function readArticles(Request $request, ManagerRegistry $doctrine, SerializerInterface $serializer)
    {
        if (null !== $request->query->get('article')) {
            $reviews = [];
            $images = [];

            $article = $doctrine->getRepository(Articles::class)
                ->findOneBy(['id' => $request->query->get('article')]);

            $imagesCollection = $article->getImages();
            $allNotes = array_fill(1, 5, 0);
            for ($i = 0; $i < count($article->getReviews()); $i++) {
                $review = [];
                $review["review"] = $article->getreviews()[$i]->getReview();
                $review["stars"] = $article->getreviews()[$i]->getStars();
                $review["firstName"] = $article->getreviews()[$i]->getUser()->getFirstName();
                $allNotes[$review['stars']]++;
                array_push($reviews, $review);
            }
            $noteMoyenne = 0;
            $compteTotal = 0;
            foreach ($allNotes as $note => $compte) {
                $noteMoyenne += $note * $compte;
                $compteTotal += $compte;
            }
            $noteMoyenne = $compteTotal > 0 ? round($noteMoyenne / $compteTotal, 1) : null;

            for ($i = 0; $i < count($imagesCollection); $i++) {
                $imageName = $imagesCollection[$i]->getImgName();
                array_push($images, $imageName);
            }
            $reviewsSerialized = $serializer->serialize($reviews, 'json');
            $jsonReview = json_decode($reviewsSerialized);
        } elseif (null !== $request->query->get('status')) {
            $article = $doctrine->getRepository(Articles::class)
                ->findBy(['status' => $request->query->get('status')]);
            $allReviews = [];
            $allImages = [];
            foreach ($article as $index => $value) {
                $allReviews[$index] = [];
                $count = 0;
                for ($i = 0; $i < count($value->getReviews()); $i++) {
                    array_push($allReviews[$index], $value->getReviews()[$i]->getStars());
                    $count++;
                }
                $allReviews[$index]['average'] = count($allReviews[$index]) === 0 ? null : round(array_sum($allReviews[$index]) / count($allReviews[$index]), 1);
                $allReviews[$index]['total'] = $count;
                $allImages[$index] = count($value->getImages()) === 0 ? null : $value->getImages()[0]->getImgName();
            }
        } else {
            $article = $doctrine->getRepository(Articles::class)
                ->findAll();
            $allReviews = [];
            $allImages = [];
            foreach ($article as $index => $value) {
                $allReviews[$index] = [];
                $count = 0;
                for ($i = 0; $i < count($value->getReviews()); $i++) {
                    array_push($allReviews[$index], $value->getReviews()[$i]->getStars());
                    $count++;
                }
                $allReviews[$index]['average'] = count($allReviews[$index]) === 0 ? null : round(array_sum($allReviews[$index]) / count($allReviews[$index]), 1);
                $allReviews[$index]['total'] = $count;
                $allImages[$index] = count($value->getImages()) === 0 ? null : $value->getImages()[0]->getImgName();
            }
        }
        $articles = json_decode($serializer->serialize($article, 'json', ['groups' => ['getArticle']]));

        if (isset($articles->id)) {
            $articles = $this->myOrganizerArticle($articles);
            $articles->averageNotes = $noteMoyenne;
            $articles->totalNotes = $compteTotal;
            $articles->allNotes = $allNotes;
            $articles->images = $images;
            $articles->reviews = $jsonReview;
        } else {
            foreach ($articles as $key => $value) {
                $articles[$key] = $this->myOrganizerArticle($value);
                $articles[$key]->averageNotes = $allReviews[$key]['average'];
                $articles[$key]->totalNotes = $allReviews[$key]['total'];
                $articles[$key]->image = $allImages[$key];
            }
        }

        return $this->json([
            'Status' => 'OK',
            'Response' => [
                'article' => $articles
            ]
        ]);
    }
    /**
     *  @Route("/articles/create", name="create_article", methods={"POST"})
     *
     */
    public function CreateArticle(ManagerRegistry $doctrine, Request $request): Response
    {
        $newArticle = $request->request;


        $creator = $doctrine->getRepository(Users::class)
            ->findOneBy(["email" => $newArticle->get("emailCreator")]);

        $mainTag = $doctrine->getRepository(MainTags::class)
            ->findOneBy(["name" => $newArticle->get("mainTag")]);


        $entityManager = $doctrine->getManager();

        $Article = new Articles();

        $Article->setUser($creator);

        $Article->setName($newArticle->get("productName"));

        $Article->setPrice($newArticle->get("price") * 100);

        $Article->setDeliveryPrice($newArticle->get("deliveryPrice") * 100);

        $Article->setDescription($newArticle->get('description'));
        $Article->setSize($newArticle->get('size'));

        $Article->setComponents($newArticle->get('components'));

        $Article->setMainTag($mainTag);

        $roles = $creator->getRoles();

        if (in_array('ROLE_ADMIN', $roles)) {
            $Article->setStatus('VALIDATED');
            $Article->setReleaseDate();
        } else {
            $Article->setStatus('WAITING');
        }

        //UPLOAD IMAGE
        $monImage = $request->files->get('images');

        foreach ($monImage as $image) {
            //on génère nv nom de fichier
            $fichier = md5(uniqid()) . '.' . $image->guessExtension();
            //copie fichier dans upload
            $image->move($this->getParameter('images_directory'), $fichier);
            // on stocke img ds la bdd (son nom)
            $img = new Images();
            $img->setImgName($fichier);
            $Article->addImage($img);
        }

        $entityManager->persist($Article);
        $entityManager->flush();

        foreach ($newArticle->get('tags') as $tag) {
            $newTag = new Tags();
            $newTag->setTagName($tag);
            $newTag->setArticle($Article);
            $entityManager->persist($newTag);
            $entityManager->flush();
        }

        return $this->json([
            'Status' => 'OK',
            'Response' => [
                'status' => $Article->getStatus(),
            ]
        ]);
    }

    /**
     *  @Route("/articles/delete/{id}", name="articles_delete", methods={"POST"})
     *
     */
    public function delete(Articles $articles, EntityManagerInterface $entityManager)
    {
        $entityManager->remove($articles);
        $entityManager->flush();
        return $this->json([
            'Status' => "DELETED"
        ]);
    }

    /**
     *  @Route("/articles/search", name="search", methods={"GET"}, priority=2)
     *
     */
    public function search(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer)
    {
        $filters = $request->query;
        $options = "WHERE a.status='VALIDATED' AND t.article=a.id AND a.mainTag=m.id";
        foreach ($filters as $filter => $value) {
            switch ($filter) {
                case 'nom':
                    $options .= " AND (a.name LIKE '%$value%' OR t.tagName LIKE '%$value%')";
                    break;
                case 'promo':
                    $options .= " AND a.promotion is not null";
                    break;
                case 'nouveau':
                    $options .= " AND DATE_DIFF(CURRENT_DATE(), a.releaseDate) <= 7";
                    break;
                case 'price':
                    $options .= " AND (";
                    foreach ($value as $index => $priceRange) {
                        $options .= $index === 0 ? '(' : ' OR (';
                        $priceRange = explode('*', $priceRange);
                        $min = intval($priceRange[0]) * 100;
                        $max = !isset($priceRange[1]) ? '' : "AND a.price <= " . (intval($priceRange[1]) * 100);
                        $options .= "a.price >= $min $max)";
                    }
                    $options .= ')';
                    break;
                case 'mainTag':
                    $options .= " AND m.name = '$value'";
                    break;
            }
        }
        $query = $entityManager->createQuery("SELECT a FROM App\Entity\Articles a INNER JOIN App\Entity\Tags t INNER JOIN App\Entity\MainTags m $options");
        $article = $query->getResult();
        $allReviews = [];
        $allImages = [];
        foreach ($article as $index => $value) {
            $allReviews[$index] = [];
            $count = 0;
            for ($i = 0; $i < count($value->getReviews()); $i++) {
                array_push($allReviews[$index], $value->getReviews()[$i]->getStars());
                $count++;
            }
            $allReviews[$index]['average'] = count($allReviews[$index]) === 0 ? null : round(array_sum($allReviews[$index]) / count($allReviews[$index]), 1);
            $allReviews[$index]['total'] = $count;
            if ($filters->get('note') !== null && $filters->get('noteCheck') !== null && $allReviews[$index]['average'] < $filters->get('note')) {
                unset($article[$index]);
                unset($allReviews[$index]);
            } else {
                $allImages[$index] = count($value->getImages()) === 0 ? null : $value->getImages()[0]->getImgName();
            }
        }
        if (count($article) === 0) {
            return $this->json([
                'Status' => 'OK',
                'Response' => [
                    'article' => 'Aucun résultat pour l\'article recherché'
                ]
            ]);
        }
        sort($article);
        $allImages = array_values($allImages);
        $allReviews = array_values($allReviews);

        $finalArticle = json_decode($serializer->serialize($article, 'json', ['groups' => ['getArticle']]));

        foreach ($finalArticle as $key => $value) {
            $finalArticle[$key] = $this->myOrganizerArticle($value);
            $finalArticle[$key]->averageNotes = $allReviews[$key]['average'];
            $finalArticle[$key]->totalNotes = $allReviews[$key]['total'];
            $finalArticle[$key]->image = $allImages[$key];
        }

        return $this->json([
            'Status' => 'OK',
            'Response' => [
                'article' => $finalArticle,
                'request' => $filters
            ]
        ]);
    }

    private function myOrganizerArticle($article)
    {
        $article->deliveryPrice = ($article->deliveryPrice / 100) . '€';
        $this->organizePrice($article->deliveryPrice);
        if (!is_null($article->promotion)) {
            $article->oldPrice = ($article->price / 100) . '€';
            $article->price = round(($article->price / 100) * (1 - $article->promotion / 100), 2) . '€';
            $this->organizePrice($article->price);
            $this->organizePrice($article->oldPrice);
            $article->promotion .= '%';
        } else {
            $article->price = ($article->price / 100) . '€';
            $this->organizePrice($article->price);
        }
        $article->releaseDate = date('d/m/Y', strtotime($article->releaseDate));
        $article->mainTag = $article->mainTag->name;
        foreach ($article->tags as $index => $tag) {
            $article->tags[$index] = $tag->tagName;
        }
        return $article;
    }

    private function organizePrice(&$price)
    {
        $tempPrice = explode('.', $price);
        if (count($tempPrice) == 2 && strlen($tempPrice[1]) === 4) {
            $tempPrice[1] = $tempPrice[1][0] . '0' . substr($tempPrice[1], 1);
        }
        $price = implode('.', $tempPrice);
    }


    /**
     * @Route("/articles/update/{id}", name="articles_update", methods={"POST"})
     */
    public function updateArticle(EntityManagerInterface $entityManager, Articles $article, Request $request)
    {
        $updateData = $request->request;
        // dump($updateData);
        foreach ($updateData as $key => $value) {
            switch ($key) {
                case 'price':
                    $article->setPrice($value * 100);
                    break;
                case 'deliveryPrice':
                    $article->setPromotion($value * 100);
                    break;
                case 'quantity':
                    $article->setStock($value);
                    break;
                case 'promotion':
                    $article->setPromotion($value);
                    break;
                case 'tags':
                    foreach ($updateData->get('tags') as $tag) {
                        $tags = new Tags();
                        $tags->setTagName($tag);
                        $tags->setArticle($article);
                        $entityManager->persist($tags);
                    }
                    break;
            }
        }
        if ($request->files->get('images') !== null) {
            foreach ($request->files->get('images') as $image) {
                //on génère nv nom de fichier
                $fichier = md5(uniqid()) . '.' . $image->guessExtension();
                //copie fichier dans upload
                $image->move($this->getParameter('images_directory'), $fichier);
                // on stocke img ds la bdd (son nom)
                $img = new Images();
                $img->setImgName($fichier);
                $article->addImage($img);
                $entityManager->persist($img);
            }
        }

        $entityManager->flush();

        return $this->json([
            "status" => "UPDATED"
        ]);
    }


    /**
     *  @Route("/articles/random", name="random", methods={"GET"}, priority=3)
     *
     */
    public function randomArticles(SerializerInterface $serializer)
    {
        $articles = [];

        $repository = $this->getDoctrine()->getRepository(Articles::class);

        for ($i = 1; $i <= 6; $i++) {
            $article = $repository->createQueryBuilder("a")->where("a.mainTag = " . $i)->andWhere("a.status = 'VALIDATED'")->orderBy("RAND()")->setMaxResults(1)->getQuery()->execute()[0];
            $imgName = $article->getImages()[0]->getImgName();
            $finalArticle = json_decode($serializer->serialize($article, 'json', ['groups' => ['getArticle']]));
            $finalArticle = $this->myOrganizerArticle($finalArticle);
            $finalArticle->image = $imgName;
            $articles[] = $finalArticle;
            $allReviews = 0;
            for ($k = 0; $k < count($article->getReviews()); $k++) {
                $allReviews += $article->getReviews()[$k]->getStars();
            }
            $allReviews = $k === 0 ? null : round($allReviews / $k, 1);
            $finalArticle->averageNotes = $allReviews;
            $finalArticle->totalNotes = $k;
        }
        while (count($articles) < 8) { // 10 ici si on veut que 8 articles aléatoire
            $article = $repository->createQueryBuilder("a")->where("a.status = 'VALIDATED'")->orderBy("RAND()")->setMaxResults(1)->getQuery()->execute()[0];
            $inArticles = false;
            foreach ($articles as $randArticle) {
                if ($randArticle->id === $article->getId()) {
                    $inArticles = true;
                    break;
                }
            }
            if (!$inArticles) {
                $imgName = $article->getImages()[0]->getImgName();
                $finalArticle = json_decode($serializer->serialize($article, 'json', ['groups' => ['getArticle']]));
                $finalArticle = $this->myOrganizerArticle($finalArticle);
                $finalArticle->image = $imgName;
                $articles[] = $finalArticle;
                $allReviews = 0;
                for ($k = 0; $k < count($article->getReviews()); $k++) {
                    $allReviews += $article->getReviews()[$k]->getStars();
                }
                $allReviews = $k === 0 ? null : round($allReviews / $k, 1);
                $finalArticle->averageNotes = $allReviews;
                $finalArticle->totalNotes = $k;
            }
        }

        return $this->json([
            'Status' => 'OK',
            "Response" => [
                "articles" => $articles
            ]
        ]);
    }

    /**
     * @Route("/articles/validation/{id}", name="articles_validation", methods={"POST"})
     */
    public function validation(EntityManagerInterface $em, Articles $article, Request $request, MailerInterface $mailer)
    {
        $status = $request->request->get("status");
        $article->setStatus($status);
        $articleName = $article->getName();
        if ($status === 'VALIDATED') {
            $article->setReleaseDate();
            $newStatus = 'validé';
        } else {
            $newStatus = 'refusé';
        }
        $email = (new Email())
            ->from('official@mako.com')
            ->to($article->getUser()->getEmail())
            ->subject("Article $newStatus")
            ->html("<h3>Mak'o Team</h3>
            <p>Hello!</p>
            <p>Votre article '$articleName' a été $newStatus.</p>
            <p>Sincèrement</p>
            <p>la Team Mak'o</p>");

        $mailer->send($email);

        $em->flush();
        return $this->json([
            "Status" => "OK"
        ]);
    }

    /**
     * @Route("/articles/recommendation/{id}", name="articles_recommendation", methods={"GET"})
     */
    public function similar(ManagerRegistry $doctrine, Articles $article, SerializerInterface $serializer)
    {
        $finalArticle = json_decode($serializer->serialize($article, 'json', ['groups' => ['getArticle']]));
        $finalArticle = $this->myOrganizerArticle($finalArticle);
        $tags = $doctrine->getRepository(Tags::class)
            ->findAllWithTags($finalArticle->tags);
        // dd($finalArticle, $tags);
        $articles = [];
        foreach ($tags as $tag) {
            $uniqueArticle = $tag->getArticle();
            if (!in_array($uniqueArticle, $articles) && $uniqueArticle !== $article) {
                array_push($articles, $uniqueArticle);
                if (count($articles) === 4) {
                    break;
                }
            }
        }
        if (count($articles) < 4) {
            $idMainTag = $doctrine->getRepository(MainTags::class)
                ->findOneBy(['name' => $finalArticle->mainTag]);
            $mainTagArticles = $doctrine->getRepository(Articles::class)
                ->findBy(['mainTag' => $idMainTag]);
            foreach ($mainTagArticles as $tempArticle) {
                if (!in_array($tempArticle, $articles) && $tempArticle !== $article) {
                    array_push($articles, $tempArticle);
                    if (count($articles) === 4) {
                        break;
                    }
                }
            }
        }

        foreach ($articles as $index => $article) {
            $imgName = $article->getImages()[0]->getImgName();
            $allReviews = 0;
            for ($k = 0; $k < count($article->getReviews()); $k++) {
                $allReviews += $article->getReviews()[$k]->getStars();
            }
            $article = json_decode($serializer->serialize($article, 'json', ['groups' => ['getArticle']]));
            $articles[$index] = $this->myOrganizerArticle($article);
            $articles[$index]->image = $imgName;
            $allReviews = $k === 0 ? null : round($allReviews / $k, 1);
            $articles[$index]->averageNotes = $allReviews;
            $articles[$index]->totalNotes = $k;
        }
        return $this->json([
            "Status" => "OK",
            "Response" => $articles
        ]);
    }

    /**
     * @Route("/articles/seller/{id}", name="articles_by_seller", methods={"GET"})
     */
    public function sellerArticles(Users $seller, SerializerInterface $serializer, ManagerRegistry $doctrine)
    {
        $articles = $doctrine->getRepository(Articles::class)
            ->findBy(['user' => $seller]);
        foreach ($articles as $index => $article) {
            $imgName = $article->getImages()[0]->getImgName();
            $allReviews = 0;
            for ($k = 0; $k < count($article->getReviews()); $k++) {
                $allReviews += $article->getReviews()[$k]->getStars();
            }
            $article = json_decode($serializer->serialize($article, 'json', ['groups' => ['getArticle']]));
            $articles[$index] = $this->myOrganizerArticle($article);
            $articles[$index]->image = $imgName;
            $allReviews = $k === 0 ? null : round($allReviews / $k, 1);
            $articles[$index]->averageNotes = $allReviews;
            $articles[$index]->totalNotes = $k;
        }
        return $this->json([
            "Status" => "OK",
            "Response" => $articles
        ]);
    }
}
