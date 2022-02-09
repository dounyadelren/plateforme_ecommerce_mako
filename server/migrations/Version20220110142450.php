<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220110142450 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE articles (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, main_tag_id INT NOT NULL, name VARCHAR(255) NOT NULL, price INT NOT NULL, components LONGTEXT NOT NULL COMMENT \'(DC2Type:array)\', description VARCHAR(511) NOT NULL, status VARCHAR(127) NOT NULL, stock INT DEFAULT NULL, promotion INT DEFAULT NULL, release_date DATETIME DEFAULT NULL, delivery_price INT NOT NULL, size VARCHAR(255) DEFAULT NULL, INDEX IDX_BFDD3168A76ED395 (user_id), INDEX IDX_BFDD316825CEDB07 (main_tag_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE delivery_types (id INT AUTO_INCREMENT NOT NULL, types VARCHAR(255) NOT NULL, price INT NOT NULL, speed INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE main_tags (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE orders (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, transport_id INT NOT NULL, order_number VARCHAR(255) NOT NULL, expedition_date DATE NOT NULL, estimated_arrival_date DATE NOT NULL, status VARCHAR(127) NOT NULL, promotion INT NOT NULL, INDEX IDX_E52FFDEEA76ED395 (user_id), INDEX IDX_E52FFDEE9909C13F (transport_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE planted_trees (id INT AUTO_INCREMENT NOT NULL, id_user_id INT NOT NULL, location_x NUMERIC(20, 15) NOT NULL, location_y NUMERIC(20, 15) NOT NULL, INDEX IDX_233710D179F37AE5 (id_user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE purchases (id INT AUTO_INCREMENT NOT NULL, article_id INT NOT NULL, orders_id INT NOT NULL, quantity INT NOT NULL, price INT NOT NULL, INDEX IDX_AA6431FE7294869C (article_id), INDEX IDX_AA6431FECFFE9AD6 (orders_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reviews (id INT AUTO_INCREMENT NOT NULL, article_id INT NOT NULL, user_id INT NOT NULL, review VARCHAR(511) DEFAULT NULL, stars INT NOT NULL, published_date DATETIME NOT NULL, INDEX IDX_6970EB0F7294869C (article_id), INDEX IDX_6970EB0FA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE seller_account_request (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, email VARCHAR(255) NOT NULL, company_name VARCHAR(255) NOT NULL, description VARCHAR(511) NOT NULL, status VARCHAR(255) NOT NULL, INDEX IDX_336F8F29A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE tags (id INT AUTO_INCREMENT NOT NULL, article_id INT NOT NULL, tag_name VARCHAR(255) NOT NULL, INDEX IDX_6FBC94267294869C (article_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(255) DEFAULT NULL, last_name VARCHAR(255) DEFAULT NULL, company VARCHAR(255) DEFAULT NULL, tel_paypal VARCHAR(255) DEFAULT NULL, email_paypal VARCHAR(255) DEFAULT NULL, roles LONGTEXT NOT NULL COMMENT \'(DC2Type:array)\', adress VARCHAR(255) DEFAULT NULL, postal_code INT DEFAULT NULL, city VARCHAR(255) DEFAULT NULL, country VARCHAR(255) DEFAULT NULL, phone VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE articles ADD CONSTRAINT FK_BFDD3168A76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE articles ADD CONSTRAINT FK_BFDD316825CEDB07 FOREIGN KEY (main_tag_id) REFERENCES main_tags (id)');
        $this->addSql('ALTER TABLE orders ADD CONSTRAINT FK_E52FFDEEA76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE orders ADD CONSTRAINT FK_E52FFDEE9909C13F FOREIGN KEY (transport_id) REFERENCES delivery_types (id)');
        $this->addSql('ALTER TABLE planted_trees ADD CONSTRAINT FK_233710D179F37AE5 FOREIGN KEY (id_user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE purchases ADD CONSTRAINT FK_AA6431FE7294869C FOREIGN KEY (article_id) REFERENCES articles (id)');
        $this->addSql('ALTER TABLE purchases ADD CONSTRAINT FK_AA6431FECFFE9AD6 FOREIGN KEY (orders_id) REFERENCES orders (id)');
        $this->addSql('ALTER TABLE reviews ADD CONSTRAINT FK_6970EB0F7294869C FOREIGN KEY (article_id) REFERENCES articles (id)');
        $this->addSql('ALTER TABLE reviews ADD CONSTRAINT FK_6970EB0FA76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE seller_account_request ADD CONSTRAINT FK_336F8F29A76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE tags ADD CONSTRAINT FK_6FBC94267294869C FOREIGN KEY (article_id) REFERENCES articles (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE purchases DROP FOREIGN KEY FK_AA6431FE7294869C');
        $this->addSql('ALTER TABLE reviews DROP FOREIGN KEY FK_6970EB0F7294869C');
        $this->addSql('ALTER TABLE tags DROP FOREIGN KEY FK_6FBC94267294869C');
        $this->addSql('ALTER TABLE orders DROP FOREIGN KEY FK_E52FFDEE9909C13F');
        $this->addSql('ALTER TABLE articles DROP FOREIGN KEY FK_BFDD316825CEDB07');
        $this->addSql('ALTER TABLE purchases DROP FOREIGN KEY FK_AA6431FECFFE9AD6');
        $this->addSql('ALTER TABLE articles DROP FOREIGN KEY FK_BFDD3168A76ED395');
        $this->addSql('ALTER TABLE orders DROP FOREIGN KEY FK_E52FFDEEA76ED395');
        $this->addSql('ALTER TABLE planted_trees DROP FOREIGN KEY FK_233710D179F37AE5');
        $this->addSql('ALTER TABLE reviews DROP FOREIGN KEY FK_6970EB0FA76ED395');
        $this->addSql('ALTER TABLE seller_account_request DROP FOREIGN KEY FK_336F8F29A76ED395');
        $this->addSql('DROP TABLE articles');
        $this->addSql('DROP TABLE delivery_types');
        $this->addSql('DROP TABLE main_tags');
        $this->addSql('DROP TABLE orders');
        $this->addSql('DROP TABLE planted_trees');
        $this->addSql('DROP TABLE purchases');
        $this->addSql('DROP TABLE reviews');
        $this->addSql('DROP TABLE seller_account_request');
        $this->addSql('DROP TABLE tags');
        $this->addSql('DROP TABLE users');
    }
}
