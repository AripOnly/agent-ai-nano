| Pola                      | Cara Kerja                                                         | Contoh                                    |
| ------------------------- | ------------------------------------------------------------------ | ----------------------------------------- |
| **Orchestration**         | 1 boss/planner membagi tugas ke agen worker, lalu merangkum hasil. | `planner → researcher + coder + reviewer` |
| **Pipeline**              | Agen bekerja berurutan, output agen A menjadi input agen B.        | `agent → agent → agent`                   |
| **Debate / Conversation** | Agen saling berdiskusi dan mengkritik hingga mencapai konsensus.   | `2 agen berdebat untuk verifikasi fakta`  |
| **Hierarchical**          | Multi-level, ada manager di atas tim agen.                         | `CEO agent → tim departemen`              |
| **Swarm / Autonomous**    | Agen otonom tanpa pusat, saling berkoordinasi melalui shared bus.  | `banyak agen kecil bereaksi pada event`   |
