<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * ProjectsWeb Entity
 *
 * @property int $id
 * @property string $name
 * @property string $slogan
 * @property string $url
 * @property string $slug
 * @property string $content
 * @property int $type_avis
 * @property string $avis
 * @property int $rating
 * @property \Cake\I18n\Time $created
 */
class ProjectsWeb extends Entity
{

    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     *
     * Note that when '*' is set to true, this allows all unspecified fields to
     * be mass assigned. For security purposes, it is advised to set '*' to false
     * (or remove it), and explicitly make individual fields accessible as needed.
     *
     * @var array
     */
    protected $_accessible = [
        '*' => true,
        'id' => false
    ];
}
