<?php

namespace App\Repository;

use App\Entity\MainTags;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method MainTags|null find($id, $lockMode = null, $lockVersion = null)
 * @method MainTags|null findOneBy(array $criteria, array $orderBy = null)
 * @method MainTags[]    findAll()
 * @method MainTags[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MainTagsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MainTags::class);
    }

    // /**
    //  * @return MainTags[] Returns an array of MainTags objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('m.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?MainTags
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
