<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Joc extends Model
{
    protected $table = 'JOC';
    public $timestamps = false;

    public function nivells(): HasMany
    {
        return $this->hasMany(Nivell::class, 'id_joc');
    }

    public function partides(): HasMany
    {
        return $this->hasMany(Partida::class, 'id_Joc');
    }
}
