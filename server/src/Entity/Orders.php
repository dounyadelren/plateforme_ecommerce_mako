<?php

namespace App\Entity;

use App\Repository\OrdersRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=OrdersRepository::class)
 */
class Orders
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"orders"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Users::class, inversedBy="orders")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"orders"})
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity=DeliveryTypes::class, inversedBy="orders")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"orders"})
     */
    private $transport;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"orders"})
     */
    private $orderNumber;

    /**
     * @ORM\Column(type="date")
     * @Groups({"orders"})
     */
    private $expeditionDate;

    /**
     * @ORM\Column(type="date")
     * @Groups({"orders"})
     */
    private $estimatedArrivalDate;

    /**
     * @ORM\Column(type="string", length=127)
     * @Groups({"orders"})
     */
    private $status;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"orders"})
     */
    private $promotion;

    /**
     * @ORM\OneToMany(targetEntity=Purchases::class, mappedBy="orders")
     * @Groups({"orders"})
     */
    private $purchases;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"orders"})
     */
    private $deliveryAdress;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"orders"})
     */
    private $deliveryPostalCode;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"orders"})
     */
    private $deliveryCity;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"orders"})
     */
    private $deliveryCountry;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"orders"})
     */
    private $nameReceiver;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"orders"})
     */
    private $firstNameReceiver;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"orders"})
     */
    private $deliveryPrice;

    public function __construct()
    {
        $this->purchases = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getTransport(): ?DeliveryTypes
    {
        return $this->transport;
    }

    public function setTransport(?DeliveryTypes $transport): self
    {
        $this->transport = $transport;

        return $this;
    }

    public function getOrderNumber(): ?string
    {
        return $this->orderNumber;
    }

    public function setOrderNumber(string $orderNumber): self
    {
        $this->orderNumber = $orderNumber;

        return $this;
    }

    public function getExpeditionDate(): ?\DateTimeInterface
    {
        return $this->expeditionDate;
    }

    public function setExpeditionDate(\DateTimeInterface $expeditionDate): self
    {
        $this->expeditionDate = $expeditionDate;

        return $this;
    }

    public function getEstimatedArrivalDate(): ?\DateTimeInterface
    {
        return $this->estimatedArrivalDate;
    }

    public function setEstimatedArrivalDate(\DateTimeInterface $estimatedArrivalDate): self
    {
        $this->estimatedArrivalDate = $estimatedArrivalDate;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getPromotion(): ?int
    {
        return $this->promotion;
    }

    public function setPromotion(int $promotion): self
    {
        $this->promotion = $promotion;

        return $this;
    }

    /**
     * @return Collection|Purchases[]
     */
    public function getPurchases(): Collection
    {
        return $this->purchases;
    }

    public function addPurchase(Purchases $purchase): self
    {
        if (!$this->purchases->contains($purchase)) {
            $this->purchases[] = $purchase;
            $purchase->setOrders($this);
        }

        return $this;
    }

    public function removePurchase(Purchases $purchase): self
    {
        if ($this->purchases->removeElement($purchase)) {
            // set the owning side to null (unless already changed)
            if ($purchase->getOrders() === $this) {
                $purchase->setOrders(null);
            }
        }

        return $this;
    }

    public function getDeliveryAdress(): ?string
    {
        return $this->deliveryAdress;
    }

    public function setDeliveryAdress(string $deliveryAdress): self
    {
        $this->deliveryAdress = $deliveryAdress;

        return $this;
    }

    public function getDeliveryPostalCode(): ?int
    {
        return $this->deliveryPostalCode;
    }

    public function setDeliveryPostalCode(int $deliveryPostalCode): self
    {
        $this->deliveryPostalCode = $deliveryPostalCode;

        return $this;
    }

    public function getDeliveryCity(): ?string
    {
        return $this->deliveryCity;
    }

    public function setDeliveryCity(string $deliveryCity): self
    {
        $this->deliveryCity = $deliveryCity;

        return $this;
    }

    public function getDeliveryCountry(): ?string
    {
        return $this->deliveryCountry;
    }

    public function setDeliveryCountry(string $deliveryCountry): self
    {
        $this->deliveryCountry = $deliveryCountry;

        return $this;
    }

    public function getNameReceiver(): ?string
    {
        return $this->nameReceiver;
    }

    public function setNameReceiver(?string $nameReceiver): self
    {
        $this->nameReceiver = $nameReceiver;

        return $this;
    }

    public function getFirstNameReceiver(): ?string
    {
        return $this->firstNameReceiver;
    }

    public function setFirstNameReceiver(?string $firstNameReceiver): self
    {
        $this->firstNameReceiver = $firstNameReceiver;

        return $this;
    }

    public function getDeliveryPrice(): ?int
    {
        return $this->deliveryPrice;
    }

    public function setDeliveryPrice(int $deliveryPrice): self
    {
        $this->deliveryPrice = $deliveryPrice;

        return $this;
    }
}
