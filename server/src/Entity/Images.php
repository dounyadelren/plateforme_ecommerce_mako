<?php

namespace App\Entity;

use App\Repository\ImagesRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ImagesRepository::class)
 */
class Images
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\ManyToOne(targetEntity=articles::class, inversedBy="images")
     * @ORM\JoinColumn(nullable=false)
     */
    private $articles;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getImgName(): ?string
    {
        return $this->name;
    }

    public function setImgName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getArticles(): ?articles
    {
        return $this->articles;
    }

    public function setArticles(?articles $articles): self
    {
        $this->articles = $articles;

        return $this;
    }
}
