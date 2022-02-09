<?php


namespace App\Controller;

use App\Entity\Articles;
use App\Entity\Orders;
use App\Entity\Users;
use App\Entity\Reviews;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * @Route("/excel", name="excel_")
 */
class ExcelController extends AbstractController
{

    /**
     *  @Route("/", name="users", methods={"GET"})
     */
    public function Excel(ManagerRegistry $doctrine)
    {
        $allUsers = $doctrine->getRepository(Users::class)->findAll();
        $articles = $doctrine->getRepository(Articles::class)->findAll();
        $orders = $doctrine->getRepository(Orders::class)->findAll();

        $admin = [];
        $seller = [];
        $users = [];

        foreach ($allUsers as $user) {
            switch ($user->getRoles()[0]) {
                case 'ROLE_USER':
                    $infoUser = $this->getUserInfo($user);
                    array_push($infoUser, strtoupper($user->getLastName()) . ' ' . $user->getFirstName());
                    $users[] = $infoUser;
                    break;
                case 'ROLE_SELLER':
                    $infoUser = $this->getUserInfo($user);
                    array_push($infoUser, ucfirst($user->getCompany()));
                    $seller[] = $infoUser;
                    break;
                case 'ROLE_ADMIN':
                    $infoUser = $this->getUserInfo($user);
                    array_push($infoUser, strtoupper($user->getLastName()) . ' ' . $user->getFirstName());
                    $admin[] = $infoUser;
                    break;
            }
        }

        foreach ($articles as $index => $article) {
            $formatArticle = [
                $article->getId(),
                $article->getUser()->getId(),
                $article->getMainTag()->getName(),
                $article->getName(),
                $article->getPrice() / 100 . '€',
                $article->getStatus(),
                ($article->getStock() === null ? '0' : $article->getStock()),
                ($article->getPromotion() === null ? '0' : $article->getPromotion()) . '%',
                $article->getReleaseDate(),
                $article->getDeliveryPrice() / 100 . '€'
            ];
            $articles[$index] = $formatArticle;
        }

        foreach ($orders as $index => $order) {
            $adress = $order->getDeliveryAdress() . ' ' . $order->getDeliveryPostalCode() . ' ' . $order->getDeliveryCity() . ' ' . $order->getDeliveryCountry();
            $formatOrder = [
                $order->getId(),
                $order->getUser()->getId(),
                $order->getTransport()->getTypes(),
                $order->getExpeditionDate()->format('d-m-Y'),
                $adress,
                strtoupper($order->getNameReceiver()) . ' ' . ucfirst($order->getFirstNameReceiver()),
                $order->getDeliveryPrice() / 100 . '€'
            ];
            $orders[$index] = $formatOrder;
        }

        $spreadsheet = new Spreadsheet();

        
        $userSheet = $spreadsheet->getActiveSheet();
        $sellerSheet = new Worksheet($spreadsheet, 'Seller List');
        $spreadsheet->addSheet($sellerSheet, 1);
        $adminSheet = new Worksheet($spreadsheet, 'Admin List');
        $spreadsheet->addSheet($adminSheet, 2);
        $articlesSheet = new Worksheet($spreadsheet, 'Articles List');
        $spreadsheet->addSheet($articlesSheet, 3);
        $ordersSheet = new Worksheet($spreadsheet, 'Orders List');
        $spreadsheet->addSheet($ordersSheet, 4);

        $userSheet->setTitle('User List');
        $userSheet->getStyle('A1:E' . (count($users) + 1))->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $this->setFields($userSheet);
        $userSheet->getCell('E1')->setValue('Name');
        $userSheet->fromArray($users, null, 'A2', true);

        $sellerSheet->getStyle('A1:E' . (count($seller) + 1))->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $this->setFields($sellerSheet);
        $sellerSheet->getCell('E1')->setValue('Company');
        $sellerSheet->fromArray($seller, null, 'A2', true);

        $adminSheet->getStyle('A1:E' . (count($admin) + 1))->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $this->setFields($adminSheet);
        $adminSheet->getCell('E1')->setValue('Name');
        $adminSheet->fromArray($admin, null, 'A2', true);

        $articlesSheet->getStyle('A1:J' . (count($articles) + 1))->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $articlesSheet->getCell('A1')->setValue('Id');
        $articlesSheet->getCell('B1')->setValue('IdSeller');
        $articlesSheet->getCell('C1')->setValue('MainTag');
        $articlesSheet->getCell('D1')->setValue('Name');
        $articlesSheet->getCell('E1')->setValue('Price');
        $articlesSheet->getCell('F1')->setValue('Status');
        $articlesSheet->getCell('G1')->setValue('Stock');
        $articlesSheet->getCell('H1')->setValue('Promotion');
        $articlesSheet->getCell('I1')->setValue('ReleaseDate');
        $articlesSheet->getCell('J1')->setValue('DeliveryPrice');
        $articlesSheet->fromArray($articles, null, 'A2', true);

        $ordersSheet->getStyle('A1:G' . (count($orders) + 1))->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $ordersSheet->getCell('A1')->setValue('Id');
        $ordersSheet->getCell('B1')->setValue('IdBuyer');
        $ordersSheet->getCell('C1')->setValue('Transport');
        $ordersSheet->getCell('D1')->setValue('ExpeditionDate');
        $ordersSheet->getCell('E1')->setValue('DeliveryAdress');
        $ordersSheet->getCell('F1')->setValue('NameReceiver');
        $ordersSheet->getCell('G1')->setValue('DeliveryPrice');
        $ordersSheet->fromArray($orders, null, 'A2', true);

        $writer = new Xlsx($spreadsheet);

        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="' . urlencode('users.xlsx') . '"');
        $writer->save('php://output');
        return $this->json([
            'Status' => 'OK',
        ]);
    }

    private function getUserInfo($user) {
        $adress = $user->getAdress() . ' ' . $user->getPostalCode() . ' ' . $user->getCity() . ' ' . $user->getCountry();
        return [
            $user->getId(),
            $user->getEmail(),
            $adress,
            $user->getPhone()
        ];
    }

    private function setFields(&$sheet) {
        $sheet->getCell('A1')->setValue('Id');
        $sheet->getCell('B1')->setValue('Mail');
        $sheet->getCell('C1')->setValue('Adress');
        $sheet->getCell('D1')->setValue('Phone');
    }
}
