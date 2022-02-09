<?php

namespace App\Controller;

use App\Entity\Orders;
use App\Entity\Articles;
use App\Entity\DeliveryTypes;
use App\Entity\Purchases;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Users;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;


class OrdersController extends AbstractController
{

    /**
     *  @Route("/orders", name="readAllOrder", methods={"GET"})
     *
     */
    public function readAllOrders(ManagerRegistry $doctrine, SerializerInterface $serializer)
    {
        $orders = $doctrine->getRepository(Orders::class)
            ->findAll();

        $orders2 = json_decode($serializer->serialize($orders, 'json', ['groups' => ['orders']]));
        foreach ($orders2 as &$order) {
            $this->organizerOrders($order);
        }

        return $this->json([
            'Status' => 'OK',
            'Response' => $orders2
        ]);
    }

    /**
     *  @Route("/orders/users/{id}", name="readOrdersUser", methods={"GET"})
     *
     */
    public function readOrdersUser(ManagerRegistry $doctrine, SerializerInterface $serializer, int $id)
    {
        $orders = $doctrine->getRepository(Orders::class)
            ->findBy(['user' => $id]);

        $orders2 = json_decode($serializer->serialize($orders, 'json', ['groups' => ['orders']]));
        foreach ($orders2 as &$order) {
            $this->organizerOrders($order);
        }

        return $this->json([
            'Status' => 'OK',
            'Response' => $orders2
        ]);
    }

    /**
     *  @Route("/orders/create", name="create_order", methods={"POST"})
     *
     */
    public function createOrder(Request $request, ManagerRegistry $doctrine, EntityManagerInterface $entityManager, MailerInterface $mailer): Response
    {
        $post = $request->request;
        $adress = $post->get("adress");
        $email = $post->get("emailUser");
        $cart = json_decode($post->get("cart"));



        $order = new Orders;
        $datetime = new \DateTime('@' . strtotime('now'));
        $deliveryDate = new \DateTime('@' . strtotime('+72 hours'));
        $user = $doctrine->getRepository(Users::class)->findOneBy(["email" => $email]);
        $deliveryType = $doctrine->getRepository(DeliveryTypes::class)->findOneBy(["types" => $post->get("deliveryType")]);
        $orderNumber = substr(sha1(mt_rand()), 17, 10);
        $status = "PREPARATION";
        $promotion = 0;

        if ($adress == "defaut") {
            $deliveryAdress = $user->getAdress();
            $deliveryPostalCode = $user->getPostalCode();
            $deliveryCity = $user->getCity();
            $deliveryCountry = $user->getCountry();
            $firstName = $user->getFirstName();
            $lastName = $user->getLastName();
        } else {
            $deliveryAdress = $post->get("deliveryAdress");
            $deliveryPostalCode = $post->get("deliveryPostalCode");
            $deliveryCity = $post->get("deliveryCity");
            $deliveryCountry = $post->get("deliveryCountry");
            $firstName = $post->get("name");
            $lastName = $post->get("lastname");
        }

        $order->setUser($user);
        $order->setFirstNameReceiver($firstName);
        $order->setNameReceiver($lastName);
        $order->setTransport($deliveryType);
        $order->setOrderNumber($orderNumber);
        $order->setExpeditionDate($datetime);
        $order->setEstimatedArrivalDate($deliveryDate);
        $order->setStatus($status);
        $order->setPromotion($promotion);
        $order->setDeliveryAdress($deliveryAdress);
        $order->setDeliveryPostalCode($deliveryPostalCode);
        $order->setDeliveryCity($deliveryCity);
        $order->setDeliveryCountry($deliveryCountry);
        $order->setDeliveryPrice($post->get('deliveryPrice') * 100);
        $entityManager->persist($order);

        $listSeller = [];

        for ($i = 0; $i < count($cart); $i++) {
            $purchase = new Purchases;
            $article = $doctrine->getRepository(Articles::class)->find($cart[$i]->id);
            $purchase->setArticle($article);
            $purchase->setOrders($order);
            $purchase->setQuantity($cart[$i]->quantityObj);
            $purchase->setPrice($cart[$i]->priceNbrArticle * 100);
            $entityManager->persist($purchase);
            $stockBeforeOrder = $article->getStock();
            $article->setStock($stockBeforeOrder - $cart[$i]->quantityObj);
            $sellerEmail = $article->getUser()->getEmail();
            $articleName = $article->getName();
            if ($stockBeforeOrder > 15 && $article->getStock() <= 15) {
                $email = (new Email())
                    ->from('official@mako.com')
                    ->to($sellerEmail)
                    ->subject('Stock bas')
                    ->html("<h3>Mak'o Team</h3>
                    <p>Hello!</p>
                    <p>Votre article '$articleName' a très peu de stock, pensez à renflouer!</p>
                    <p>Sincèrement</p>
                    <p>la Team Mak'o</p>");

                $mailer->send($email);
            }
            if (!isset($listSeller[$sellerEmail])) {
                $listSeller[$sellerEmail] = [];
            }
            array_push($listSeller[$sellerEmail], [$articleName, $purchase->getQuantity()]);
        }

        $contentMailToBuyer = "<h3>Mak'o Team</h3><p>Félicitation !</p><p>La commande que vous avez effectué sur notre site est validé !</p><p>Voici un recapitulatif : </p><ul>";

        foreach ($listSeller as $seller => $listArticles) {
            $allArticles = '';
            foreach ($listArticles as $article) {
                $allArticles .= " $article[0] ($article[1])";
                $contentMailToBuyer .= "<li>$article[0] ($article[1])</li>";
            }
            $email = (new Email())
                ->from('official@mako.com')
                ->to($seller)
                ->subject('Achat effectué')
                ->html("<h3>Mak'o Team</h3>
                <p>Bonjour, les articles suivants ont été acheté sur notre site : $allArticles.</p>
                <p>Sincèrement</p>
                <p> La Team Mak'o</p>");

            $mailer->send($email);
        }

        $contentMailToBuyer .= "</ul><p>Sincèrement</p><p> La Team Mak'o</p>";

        $email = (new Email())
            ->from('official@mako.com')
            ->to($user->getEmail())
            ->subject('Achat effectué')
            ->html($contentMailToBuyer);

        $mailer->send($email);

        $entityManager->flush();

        return $this->json([
            "Status" => "OK"
        ]);
    }


    /**
     *  @Route("/orders/update/{id}", name="orders_update", methods={"POST"})
     *
     */
    public function cancelOrder(Request $request, Orders $order, EntityManagerInterface $entityManager, MailerInterface $mailer)
    {
        if ($order->getStatus() == "PREPARATION" || $order->getStatus() == "SHIPPED") {
            $status = $request->request->get("status");
            $order->setStatus($status);
            $entityManager->flush();
            if ($status === 'SHIPPED') {
                $email = (new Email())
                    ->from('official@mako.com')
                    ->to($order->getUser()->getEmail())
                    ->subject('Commande expédiée')
                    ->html("<h3>Mak'o Team</h3>
                    <p>Bonjour, votre commande a été expédiée et sera livrée dans les jours à venir.</p>
                    <p>Sincèrement</p>
                    <p> La Team Mak'o</p>");

                $mailer->send($email);
            } else if ($status === "DELIVERED") {
                $email = (new Email())
                    ->from('official@mako.com')
                    ->to($order->getUser()->getEmail())
                    ->subject('Commande livrée')
                    ->html("<h3>Mak'o Team</h3>
                    <p>Bonjour, votre commande a été livrée à votre domicile.</p>
                    <p>Sincèrement</p>
                    <p> La Team Mak'o</p>");

                $mailer->send($email);
            } else if ($status === "CANCELED") {
                $email = (new Email())
                    ->from('official@mako.com')
                    ->to($order->getUser()->getEmail())
                    ->subject('Commande annulée')
                    ->html("<h3>Mak'o Team</h3>
                    <p>Bonjour, votre commande a bien été annulée.</p>
                    <p>Sincèrement</p>
                    <p> La Team Mak'o</p>");

                $mailer->send($email);
            }
            return $this->json([
                'Status' => 'OK',
                'Response' => $status
            ]);
        } else {
            return $this->json([
                'Status' => "KO",
                'Response' => "Already modified"
            ]);
        }
    }

    /**
     *  @Route("/orders/{id}", name="readOneOrder", methods={"GET"})
     *
     */
    public function readOrder(Orders $order, Request $request, SerializerInterface $serializer)
    {
        $testArticle = json_decode($serializer->serialize($order, 'json', ['groups' => ['orders']]));
        $this->organizerOrders($testArticle);
        return $this->json([
            'Status' => 'OK',
            'Response' => $testArticle
        ]);
    }

    /**
     *  @Route("/orders/deliveryTypes", name="readDeliveryTypes", methods={"GET"}, priority=2)
     *
     */
    public function deliveryTypes(SerializerInterface $serializer, ManagerRegistry $doctrine)
    {
        $types = $doctrine->getRepository(DeliveryTypes::class)
            ->findAll();
        $jsonTypes = json_decode($serializer->serialize($types, 'json', ['groups' => ['dTypes']]));
        // foreach ($jsonTypes as $index => $type) {
        //     $jsonTypes[$index]->speed = $type->speed . 'km/h';
        // }
        return $this->json([
            'Status' => 'OK',
            'Response' => $jsonTypes
        ]);
    }

    private function organizerOrders(&$order)
    {
        $order->transport = $order->transport->types;
        $order->expeditionDate = date('d-m-Y', strtotime($order->expeditionDate));
        $order->estimatedArrivalDate = date('d-m-Y', strtotime($order->estimatedArrivalDate));
        $order->promotion .= '%';
        foreach ($order->purchases as $index => $purchase) {
            $order->purchases[$index]->article = $purchase->article->name;
            $order->purchases[$index]->price = ($purchase->price / 100) . '€';
        }
        $order->deliveryPrice = ($order->deliveryPrice / 100) . '€';
        // dd($order);
    }
}
