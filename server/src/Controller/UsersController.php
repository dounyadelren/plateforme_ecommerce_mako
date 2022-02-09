<?php

namespace App\Controller;

use App\Entity\Users;
use App\Entity\SellerAccountRequest;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\SellerAccountRequestRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;



class UsersController extends AbstractController
{
    /**
     *  @Route("/users", name="users", methods={"GET"})
     */
    public function find(Request $request, ManagerRegistry $doctrine, SerializerInterface $serializer): Response
    {
        if (null !== $request->query->get('email')) {
            $email = $request->query->get("email");
            $users = $doctrine->getRepository(Users::class)
                ->findOneBy(["email" => $email]);
        } else {
            $users = $doctrine->getRepository(Users::class)
                ->findAll();
        }
        $jsonContent = $serializer->serialize($users, 'json', ['groups' => ['user']]);
        return $this->json([
            'Status' => 'OK',
            'Response' => [
                'users' => json_decode($jsonContent)
            ]
        ]);
    }

    /**
     *  @Route("/users/register", name="register", methods={"POST"})
     */
    public function register(ManagerRegistry $doctrine, Request $request): Response
    {
        $newUser = $request->request;

        $user = $doctrine->getRepository(Users::class)
            ->findOneBy(["email" => $newUser->get("email")]);
        $sellerAccountRequest = $doctrine->getRepository(SellerAccountRequest::class)
            ->findOneBy(["email" => $newUser->get("email"), "status" => "WAITING"]);

        if (!is_null($user) || !is_null($sellerAccountRequest)) {
            return ($this->json([
                'Status' => 'KO',
                'Response' => [
                    'error' => 'email'
                ]
            ]));
        }


        $entityManager = $doctrine->getManager();
        $user = new Users();
        $hash = password_hash($newUser->get("password"), PASSWORD_DEFAULT);
        $user->setEmail($newUser->get("email"));
        $user->setPassword($hash);
        switch (strtolower($newUser->get("role"))) {
            case 'user':
                $user->setRoles(['ROLE_USER']);
                break;
            case 'seller':
                $user->setRoles(['ROLE_SELLER']);
                break;
            case 'admin':
                $user->setRoles(['ROLE_ADMIN']);
                break;
        }
        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json([
            'Status' => 'OK',
            'Response' => [
                'email' => $newUser->get("email")
            ]
        ]);
    }

    /**
     *  @Route("/users/connect", name="connect", methods={"POST"})
     */
    public function connect(ManagerRegistry $doctrine, Request $request, SerializerInterface $serializer): Response
    {
        $infosConnect = $request->request;
        $user = $doctrine
            ->getRepository(Users::class)
            ->findOneBy(["email" => $infosConnect->get('email')]);
        if (is_null($user)) {
            return ($this->json([
                'Status' => 'KO',
                'Response' => [
                    'error' => 'email'
                ]
            ]));
        }
        if (!password_verify($infosConnect->get('password'), $user->getPassword())) {
            return ($this->json([
                'Status' => 'KO',
                'Response' => [
                    'error' => 'password'
                ]
            ]));
        }
        $jsonContent = $serializer->serialize($user, 'json', ['groups' => ['user']]);
        return ($this->json([
            'Status' => 'OK',
            'Response' => json_decode($jsonContent)
        ]));
    }


    /**
     *  @Route("/users/update", name="user_update", methods={"POST"})
     */
    public function update(ManagerRegistry $doctrine, Request $request, SerializerInterface $serializer)
    {
        $entityManager = $doctrine->getManager();

        $infoUser = $request->request;
        $user = $doctrine->getRepository(Users::class)
            ->findOneBy(["email" => $infoUser->get("email")]);

        foreach ($infoUser as $key => $value) {
            switch ($key) {
                case 'nom':
                    $user->setLastName($value);
                    break;
                case 'prenom':
                    $user->setFirstName($value);
                    break;
                case 'adresse':
                    $user->setAdress($value);
                    break;
                case 'codePostal':
                    $user->setPostalCode($value);
                    break;
                case 'ville':
                    $user->setCity($value);
                    break;
                case 'pays':
                    $user->setCountry($value);
                    break;
                case 'tel':
                    $user->setPhone($value);
                    break;
                case 'compagnie':
                    $user->setCompany($value);
                    break;
            }
        }
        $entityManager->flush();

        $jsonContent = $serializer->serialize($user, 'json', ['groups' => ['user']]);

        return ($this->json([
            'Status' => 'OK',
            'Response' => json_decode($jsonContent),

        ]));
    }

    /**
     *  @Route("/users/password", name="user_password", methods={"POST"})
     */
    public function updatePassword(ManagerRegistry $doctrine, Request $request, SerializerInterface $serializer)
    {
        $infoUser = $request->request;

        $entityManager = $doctrine->getManager();

        $user = $doctrine->getRepository(Users::class)
            ->findOneBy(["email" => $infoUser->get("email")]);

        if (!password_verify($infoUser->get('oldPassword'), $user->getPassword())) {
            return ($this->json([
                'Status' => 'KO',
                'Response' => [
                    'error' => 'password'
                ],
            ]));
        }

        $hash = password_hash($infoUser->get("newPassword"), PASSWORD_DEFAULT);
        $user->setPassword($hash);

        $entityManager->flush();

        return ($this->json([
            'Status' => 'OK'
        ]));
    }

    /**
     * @Route("/sellers/register",name="vendeur_inscription", methods={"POST"})
     */
    public function sellerSubscribe(Request $request, ManagerRegistry $doctrine)
    {
        $post = $request->request;
        $seller = $doctrine->getRepository(SellerAccountRequest::class)
            ->findOneBy(["email" => $post->get("email"), "status" => 'WAITING']);
        $user = $doctrine->getRepository(Users::class)
            ->findOneBy(["email" => $post->get("email")]);

        if (!is_null($seller) || !is_null($user)) {
            return $this->json([
                'Status' => 'KO',
                'Response' => [
                    'error' => 'email'
                ]
            ]);
        }

        $em = $doctrine->getManager();

        $seller = new SellerAccountRequest();

        $seller->setEmail($post->get("email"));
        $seller->setCompanyName($post->get("companyName"));
        $seller->setDescription($post->get("description"));
        $seller->setStatus('WAITING');
        $seller->setAdress($post->get('adress'));
        $seller->setPostalCode($post->get('codePostal'));
        $seller->setCity($post->get('city'));
        $seller->setCountry($post->get('pays'));
        $seller->setPhone($post->get('tel'));

        $em->persist($seller);
        $em->flush();
        return $this->json([
            'Status' => 'OK',
        ]);
    }

    /**
     * @Route("/seller/status/{id}", name="seller_status",methods={"POST"})
     */
    public function statusVendor(ManagerRegistry $doctrine, Request $request, SellerAccountRequest $seller, MailerInterface $mailer)
    {
        $post = $request->request;
        $em = $doctrine->getManager();
        $seller->setStatus($post->get("status"));

        /*if status === "validated"{
            create account()
        }
        */

        $email = (new Email())
            ->from('official@mako.com')
            ->to($seller->getEmail())
            ->subject('Statut du compte vendeur actualisé');

        if ($seller->getStatus() == "VALIDATED") {
            $user = new Users();
            $user->setEmail($seller->getEmail());
            $user->setCompany($seller->getCompanyName());
            $user->setRoles(["ROLE_SELLER"]);
            $user->setAdress($seller->getAdress());
            $user->setPostalCode($seller->getPostalCode());
            $user->setCity($seller->getCity());
            $user->setCountry($seller->getCountry());
            $user->setPhone($seller->getPhone());
            $password = substr(sha1(mt_rand()), 17, 10);
            $hashed = password_hash($password, PASSWORD_DEFAULT);
            $user->setPassword($hashed);
            $em->persist($user);
            $email->html("<h3>Mak'o Team</h3>
            <p>Hello!</p>
            <p>Votre compte a été accepté. Votre mot de passe est '$password'. Bonne vente sur notre site.</p>
            <p>Sincèrement</p>
            <p> la Team Mak'o</p>");
        } else {
            $email->html("
            <h3>Mak'o Team</h3>
            <p>Hello!</p>
            <p>Nous sommes désolé, mais votre compte a été refusé. Nos administrateurs ont estimé que votre étique de vente ne correspond pas à la nôtre. Nous vous souhaitons une bonne continuation</p>
            <p>Sincèrement</p>
            <p> la Team Mak'o</p>");
        }
        $mailer->send($email);
        $em->flush();


        return $this->json([
            'Status' => $seller
        ]);
    }

    /**
     * @Route("/seller/request", name="vendeur_request", methods={"GET"})
     */
    public function readRequest(SellerAccountRequestRepository $requestSeller)
    {
        $reqs = $requestSeller->findAll();
        // dd($reqs);

        return $this->json([
            'Status' => $reqs
        ]);
    }

    /**
     * @Route("/forgotPassword", name="forgot_password", methods={"POST"})
     */
    public function forgotPassword(Request $request, ManagerRegistry $doctrine, MailerInterface $mailer)
    {

        $em = $doctrine->getManager();

        $mailForgot = $request->request->get('email');
        $user = $doctrine->getRepository(Users::class)
            ->findOneBy(["email" => $mailForgot]);
        if (is_null($user)) {
            return $this->json([
                'Status' => 'KO'
            ]);
        }
        // dd($user);
        $password = substr(sha1(mt_rand()), 17, 10);
        $hashed = password_hash($password, PASSWORD_DEFAULT);
        $user->setPassword($hashed);

        $email = (new Email())
            ->from('official@mako.com')
            ->to($mailForgot)
            ->subject('Mot de passe oublié')
            // ->text("Mak'o Team Votre mot de passe")
            ->html("<h3>Mak'o Team</h3>
            <p>Hello!</p>
            <p>Votre mot de passe a été modifié. Votre nouveau mot de passe est '$password'.</p>
            <p>Sincèrement</p>
            <p>la Team Mak'o</p>");

        $mailer->send($email);
        $em->flush();
        return $this->json([
            'Status' => 'OK'
        ]);
    }
}
