<?php

namespace App\Entity;

use App\Repository\ArticlesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ArticlesRepository::class)
 */
class Articles
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"getArticle"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Users::class, inversedBy="articles",fetch="EAGER")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"getArticle"})
     */
    private $user;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"getArticle", "reviews", "orders"})
     */
    private $name;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"getArticle"})
     */
    private $price;

    /**
     * @ORM\Column(type="array")
     * @Groups({"getArticle"})
     */
    private $components = [];

    /**
     * @ORM\Column(type="string", length=511)
     * @Groups({"getArticle"})
     */
    private $description;

    /**
     * @ORM\Column(type="string", length=127)
     * @Groups({"getArticle"})
     */
    private $status;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"getArticle"})
     */
    private $stock;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"getArticle"})
     */
    private $promotion;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"getArticle"})
     */
    private $releaseDate;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"getArticle"})
     */
    private $deliveryPrice;

    /**
     * @ORM\OneToMany(targetEntity=Tags::class, mappedBy="article", orphanRemoval=true)
     * @Groups({"getArticle"})
     */
    private $tags;

    /**
     * @ORM\OneToMany(targetEntity=Reviews::class, mappedBy="article", orphanRemoval=true)
     * @Groups({"BUG"})
     */
    private $reviews;

    /**
     * @ORM\OneToMany(targetEntity=Purchases::class, mappedBy="article")
     */
    private $purchases;

    /**
     * @ORM\Column(type="array", nullable=true)
     * @Groups({"getArticle"})
     */
    private $size;

    /**
     * @ORM\ManyToOne(targetEntity=MainTags::class, inversedBy="articles")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"getArticle"})
     */
    private $mainTag;

    /**
     * @ORM\OneToMany(targetEntity=Images::class, mappedBy="articles", orphanRemoval=true, cascade={"persist"})
     */
    private $images;

    public function __construct()
    {
        $this->tags = new ArrayCollection();
        $this->reviews = new ArrayCollection();
        $this->purchases = new ArrayCollection();
        $this->images = new ArrayCollection();
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

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

    public function getComponents(): ?array
    {
        return $this->components;
    }

    public function setComponents(array $components): self
    {
        $this->components = $components;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

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

    public function getStock(): ?int
    {
        return $this->stock;
    }

    public function setStock(?int $stock): self
    {
        $this->stock = $stock;

        return $this;
    }

    public function getPromotion(): ?int
    {
        return $this->promotion;
    }

    public function setPromotion(?int $promotion): self
    {
        $this->promotion = $promotion;

        return $this;
    }

    public function getReleaseDate(): ?\DateTimeInterface
    {
        return $this->releaseDate;
    }

    public function setReleaseDate(): self
    {
        $this->releaseDate = new \DateTime("now");

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

    /**
     * @return Collection|Tags[]
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }

    public function addTag(Tags $tag): self
    {
        if (!$this->tags->contains($tag)) {
            $this->tags[] = $tag;
            $tag->setArticle($this);
        }

        return $this;
    }

    public function removeTag(Tags $tag): self
    {
        if ($this->tags->removeElement($tag)) {
            // set the owning side to null (unless already changed)
            if ($tag->getArticle() === $this) {
                $tag->setArticle(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Reviews[]
     */
    public function getReviews(): Collection
    {
        return $this->reviews;
    }

    public function addReview(Reviews $review): self
    {
        if (!$this->reviews->contains($review)) {
            $this->reviews[] = $review;
            $review->setArticle($this);
        }

        return $this;
    }

    public function removeReview(Reviews $review): self
    {
        if ($this->reviews->removeElement($review)) {
            // set the owning side to null (unless already changed)
            if ($review->getArticle() === $this) {
                $review->setArticle(null);
            }
        }

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
            $purchase->setArticle($this);
        }

        return $this;
    }

    public function removePurchase(Purchases $purchase): self
    {
        if ($this->purchases->removeElement($purchase)) {
            // set the owning side to null (unless already changed)
            if ($purchase->getArticle() === $this) {
                $purchase->setArticle(null);
            }
        }

        return $this;
    }

    public function getSize(): ?array
    {
        return $this->size;
    }

    public function setSize(?array $size): self
    {
        $this->size = $size;

        return $this;
    }

    public function getMainTag(): ?MainTags
    {
        return $this->mainTag;
    }

    public function setMainTag(?MainTags $mainTag): self
    {
        $this->mainTag = $mainTag;

        return $this;
    }

    /**
     * @return Collection|Images[]
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(Images $image): self
    {
        if (!$this->images->contains($image)) {
            $this->images[] = $image;
            $image->setArticles($this);
        }

        return $this;
    }

    public function removeImage(Images $image): self
    {
        if ($this->images->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getArticles() === $this) {
                $image->setArticles(null);
            }
        }

        return $this;
    }
}
