<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220131085154 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE seller_account_request DROP FOREIGN KEY FK_336F8F29A76ED395');
        $this->addSql('DROP INDEX IDX_336F8F29A76ED395 ON seller_account_request');
        $this->addSql('ALTER TABLE seller_account_request DROP user_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE seller_account_request ADD user_id INT NOT NULL');
        $this->addSql('ALTER TABLE seller_account_request ADD CONSTRAINT FK_336F8F29A76ED395 FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_336F8F29A76ED395 ON seller_account_request (user_id)');
    }
}
