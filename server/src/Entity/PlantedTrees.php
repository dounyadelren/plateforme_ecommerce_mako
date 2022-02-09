<?php

namespace App\Entity;

use App\Repository\PlantedTreesRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=PlantedTreesRepository::class)
 */
class PlantedTrees
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=users::class, inversedBy="plantedTrees")
     * @ORM\JoinColumn(nullable=false)
     */
    private $idUser;

    /**
     * @ORM\Column(type="decimal", precision=20, scale=15)
     */
    private $locationX;

    /**
     * @ORM\Column(type="decimal", precision=20, scale=15)
     */
    private $locationY;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdUser(): ?users
    {
        return $this->idUser;
    }

    public function setIdUser(?users $idUser): self
    {
        $this->idUser = $idUser;

        return $this;
    }

    public function getLocationX(): ?string
    {
        return $this->locationX;
    }

    public function setLocationX(string $locationX): self
    {
        $this->locationX = $locationX;

        return $this;
    }

    public function getLocationY(): ?string
    {
        return $this->locationY;
    }

    public function setLocationY(string $locationY): self
    {
        $this->locationY = $locationY;

        return $this;
    }
}
