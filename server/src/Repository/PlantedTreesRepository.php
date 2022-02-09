<?php

namespace App\Repository;

use App\Entity\PlantedTrees;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method PlantedTrees|null find($id, $lockMode = null, $lockVersion = null)
 * @method PlantedTrees|null findOneBy(array $criteria, array $orderBy = null)
 * @method PlantedTrees[]    findAll()
 * @method PlantedTrees[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PlantedTreesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PlantedTrees::class);
    }

    // /**
    //  * @return PlantedTrees[] Returns an array of PlantedTrees objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?PlantedTrees
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
