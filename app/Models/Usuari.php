<?php

namespace App\Models;

use App\Models\Partida;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Usuari extends Authenticatable
{
  
protected $table = 'USUARI';
public $timestamps = false;

 public function partides(): HasMany
    {
        return $this->hasMany(Partida::class, 'id_Usuari');
    }

 public function estatJoc(int $numero): string
    {
        $progres = max(1, (int) $this->progresJoc);
        
        if ($numero < $progres) {
            return 'completat';
        }
        return $numero === $progres ? 'disponible' : 'bloquejat';
    }

 public function superarJoc(int $numero): void
    {
        if($this->estatJoc($numero) === 'disponible') {
            $this->progresJoc = $numero + 1;
            $this->save();
        }
    }
}
