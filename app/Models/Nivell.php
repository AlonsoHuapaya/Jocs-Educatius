<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Nivell extends Model
{
    protected $table = 'NIVELL';
    public $timestamps = false;

    public function joc(): BelongsTo
    {
        return $this->belongsTo(Joc::class, 'id_joc');
    }

    public function partides(): HasMany
    {
        return $this->hasMany(Partida::class, 'id_Nivell');
    }
}
