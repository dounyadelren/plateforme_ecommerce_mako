<?php

namespace App\Controller;

use App\Entity\Articles;
use App\Entity\Users;
use App\Entity\Reviews;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;

class ReviewsController extends AbstractController
{

    /**
     *  @Route("/reviews/create", name="reviews_create", methods={"GET", "POST"})
     */
    public function create(ManagerRegistry $doctrine, Request $request): Response
    {   
        $newReview = $request->request;
        $entityManager = $doctrine->getManager();

        $article = $doctrine->getRepository(Articles::class)
            ->findOneBy(["id"=> $newReview->get("idArticle")]);

        $user = $doctrine->getRepository(Users::class)
            ->findOneBy(["email" => $newReview->get("email")]);

        $review = new Reviews();
        $review->setArticle($article);
        $review->setUser($user);
        $review->setPublishedDate();
        $review->setReview($newReview->get("review"));
        $review->setStars(intval($newReview->get("stars")));

        $entityManager->persist($review);
        $entityManager->flush();

        return $this->json([
            'Status' => 'OK',
        ]);
    }

    /**
     *  @Route("/reviews/delete/{id}", name="reviews_delete", methods={"GET"})
     */
    public function delete(Reviews $review, EntityManagerInterface $entityManager): Response
    {   

        $entityManager->remove($review);
        $entityManager->flush();

        return ($this->json([
            'Status' => 'OK',
        ]));
    }


    /**
     *  @Route("/reviews", name="reviews", methods={"GET"})
     */
    public function show(ManagerRegistry $doctrine): Response
    {   

        $reviews = [];
        
        $article = $doctrine->getRepository(Articles::class)->find(1);
        // dd(count($article->getReviews()));
        // $reviews = $articles[0]->getreviews()[1]->getReview();
        // dd(count($articles[0]->getReviews()));
        for ($i=0; $i < count($article->getReviews()); $i++) {
            $review = [];
            $review["review"] = $article->getreviews()[$i]->getReview();
            $review["stars"] = $article->getreviews()[$i]->getStars();
            $review["email"] = $article->getreviews()[$i]->getUser()->getEmail();
            array_push($reviews,$review);
        }
            // dd(json_encode($reviews));
        return ($this->json([
            'Status' => 'OK !',
            "Reviews" => json_encode($reviews)
        ]));
    }
    
}
