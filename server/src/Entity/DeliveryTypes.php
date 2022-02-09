<?php

namespace App\Entity;

use App\Repository\DeliveryTypesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=DeliveryTypesRepository::class)
 */
class DeliveryTypes
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"dTypes"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"dTypes", "orders"})
     */
    private $types;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"dTypes"})
     */
    private $price;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"dTypes"})
     */
    private $speed;

    /**
     * @ORM\OneToMany(targetEntity=Orders::class, mappedBy="transport")
     */
    private $orders;

    public function __construct()
    {
        $this->orders = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTypes(): ?string
    {
        return $this->types;
    }

    public function setTypes(string $types): self
    {
        $this->types = $types;

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

    public function getSpeed(): ?int
    {
        return $this->speed;
    }

    public function setSpeed(int $speed): self
    {
        $this->speed = $speed;

        return $this;
    }

    /**
     * @return Collection|Orders[]
     */
    public function getOrders(): Collection
    {
        return $this->orders;
    }

    public function addOrder(Orders $order): self
    {
        if (!$this->orders->contains($order)) {
            $this->orders[] = $order;
            $order->setTransport($this);
        }

        return $this;
    }

    public function removeOrder(Orders $order): self
    {
        if ($this->orders->removeElement($order)) {
            // set the owning side to null (unless already changed)
            if ($order->getTransport() === $this) {
                $order->setTransport(null);
            }
        }

        return $this;
    }
}
