import type { Team } from '@/types';

// Grupos: composición REAL del sorteo. Ratings de fuerza: ESTIMACIÓN del analista.
type Seed = [string, string, string, number, number]; // id, nombre, bandera, attack, defense
const G: Record<string, Seed[]> = {
  A: [['MEX','México','🇲🇽',1.15,.88],['RSA','Sudáfrica','🇿🇦',.80,1.05],['KOR','Corea del Sur','🇰🇷',1.05,.95],['CZE','Chequia','🇨🇿',1.00,.95]],
  B: [['CAN','Canadá','🇨🇦',1.00,.95],['BIH','Bosnia','🇧🇦',.95,1.00],['QAT','Catar','🇶🇦',.85,1.05],['SUI','Suiza','🇨🇭',1.10,.82]],
  C: [['BRA','Brasil','🇧🇷',1.60,.68],['MAR','Marruecos','🇲🇦',1.15,.72],['HAI','Haití','🇭🇹',.70,1.25],['SCO','Escocia','🏴󠁧󠁢󠁳󠁣󠁴󠁿',.95,.95]],
  D: [['USA','Estados Unidos','🇺🇸',1.10,.90],['PAR','Paraguay','🇵🇾',.85,.88],['AUS','Australia','🇦🇺',.90,.95],['TUR','Türkiye','🇹🇷',1.15,.98]],
  E: [['GER','Alemania','🇩🇪',1.50,.75],['CUW','Curazao','🇨🇼',.65,1.30],['CIV','Costa de Marfil','🇨🇮',1.05,.90],['ECU','Ecuador','🇪🇨',1.00,.78]],
  F: [['NED','Países Bajos','🇳🇱',1.45,.78],['JPN','Japón','🇯🇵',1.20,.85],['SWE','Suecia','🇸🇪',1.05,.90],['TUN','Túnez','🇹🇳',.85,.85]],
  G: [['BEL','Bélgica','🇧🇪',1.30,.82],['EGY','Egipto','🇪🇬',1.00,.85],['IRN','Irán','🇮🇷',.90,.78],['NZL','Nueva Zelanda','🇳🇿',.75,1.10]],
  H: [['ESP','España','🇪🇸',1.65,.62],['CPV','Cabo Verde','🇨🇻',.75,1.05],['KSA','Arabia Saudí','🇸🇦',.80,1.05],['URU','Uruguay','🇺🇾',1.25,.80]],
  I: [['FRA','Francia','🇫🇷',1.62,.65],['SEN','Senegal','🇸🇳',1.10,.70],['IRQ','Irak','🇮🇶',.80,1.05],['NOR','Noruega','🇳🇴',1.35,.95]],
  J: [['ARG','Argentina','🇦🇷',1.55,.60],['ALG','Argelia','🇩🇿',.95,.90],['AUT','Austria','🇦🇹',1.05,.92],['JOR','Jordania','🇯🇴',.75,1.10]],
  K: [['POR','Portugal','🇵🇹',1.50,.70],['COD','RD Congo','🇨🇩',.90,1.00],['UZB','Uzbekistán','🇺🇿',.85,1.00],['COL','Colombia','🇨🇴',1.20,.82]],
  L: [['ENG','Inglaterra','🏴󠁧󠁢󠁥󠁮󠁧󠁿',1.50,.62],['CRO','Croacia','🇭🇷',1.15,.85],['GHA','Ghana','🇬🇭',.95,1.00],['PAN','Panamá','🇵🇦',.80,1.05]],
};

export const MOCK_TEAMS: Team[] = Object.entries(G).flatMap(([gid, seeds]) =>
  seeds.map(([id, name, flag, attack, defense]) => ({ id, name, flag, groupId: gid, attack, defense }))
);
export const GROUP_IDS = Object.keys(G);
export const TEAMS_BY_GROUP: Record<string, string[]> =
  Object.fromEntries(Object.entries(G).map(([gid, s]) => [gid, s.map(x => x[0])]));
