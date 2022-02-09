<?php

namespace App\Entity;

use App\Repository\PurchasesRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=PurchasesRepository::class)
 */
class Purchases
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=articles::class, inversedBy="purchases")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"orders"})
     */
    private $article;

    /**
     * @ORM\ManyToOne(targetEntity=orders::class, inversedBy="purchases")
     * @ORM\JoinColumn(nullable=false)
     */
    private $orders;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"orders"})
     */
    private $quantity;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"orders"})
     */
    private $price;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"orders"})
     */
    private $size;


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

    public function getOrders(): ?orders
    {
        return $this->orders;
    }

    public function setOrders(?orders $orders): self
    {
        $this->orders = $orders;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getSize(): ?int
    {
        return $this->size;
    }

    public function setSize(int $size): self
    {
        $this->size = $size;

        return $this;
    }
}
