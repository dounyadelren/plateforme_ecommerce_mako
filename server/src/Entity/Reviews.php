<?php

namespace App\Entity;

use App\Repository\ReviewsRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ReviewsRepository::class)
 */
class Reviews
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Articles::class, inversedBy="reviews",fetch="EAGER")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"reviews"})
     */
    private $article;

    /**
     * @ORM\ManyToOne(targetEntity=Users::class, inversedBy="reviews",fetch="EAGER")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"getArticle", "reviews"})
     */
    private $user;

    /**
     * @ORM\Column(type="string", length=511, nullable=true)
     * @Groups({"getArticle", "reviews"})
     */
    private $review;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"getArticle", "reviews"})
     */
    private $stars;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"getArticle", "reviews"})
     */
    private $publishedDate;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getArticle(): ?articles
    {
        return $this->article;
    }

    public function setArticle(?articles $article): self
    {
        $this->article = $article;

        return $this;
    }

    public function getUser(): ?users
    {
        return $this->user;
    }

    public function setUser(?users $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getReview(): ?string
    {
        return $this->review;
    }

    public function setReview(?string $review): self
    {
        $this->review = $review;

        return $this;
    }

    public function getStars(): ?int
    {
        return $this->stars;
    }

    public function setStars(int $stars): self
    {
        $this->stars = $stars;

        return $this;
    }

    public function getPublishedDate(): ?\DateTimeInterface
    {
        return $this->publishedDate;
    }

    public function setPublishedDate(): self
    {
        $this->publishedDate = new \DateTime("now");

        return $this;
    }
}
