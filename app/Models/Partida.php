<?php

namespace App\Models;





use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Joc;
use App\Models\Nivell;
use App\Models\Usuari;
use Illuminate\Database\Eloquent\Model;

class Partida extends Model
{
    protected $table = 'PARTIDA';
    public $timestamps = false;

  
    public function usuari(): BelongsTo
    {
        return $this->belongsTo(Usuari::class, 'id_Usuari');
    }

    public function joc(): BelongsTo
    {
        return $this->belongsTo(Joc::class, 'id_Joc');
    }

    public function nivell(): BelongsTo
    {
        return $this->belongsTo(Nivell::class, 'id_Nivell');
    }
}
