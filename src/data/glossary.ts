export interface GlossaryTerm {
  id: string;
  term: string;
  termFr: string;
  definition: string;
  definitionFr: string;
  category: "state" | "mechanic" | "role" | "concept" | "game";
  relatedTerms?: string[];
  icon?: { src: string; alt: string };
}

const baseGlossary: GlossaryTerm[] = [
  {
    id: "ability",
    term: "Ability",
    termFr: "Capacité",
    definition:
      "The special power listed on a player's character token. Abilities are the primary means by which players gather information, affect other players, or influence the outcome of the game. Most abilities are automatic or triggered under specific conditions.",
    definitionFr:
      "Le pouvoir spécial indiqué sur le jeton de personnage d'un joueur. Les capacités sont le principal moyen par lequel les joueurs recueillent des informations, affectent les autres joueurs ou influencent le résultat de la partie. La plupart des capacités sont automatiques ou déclenchées sous des conditions spécifiques.",
    category: "mechanic",
    relatedTerms: ["drunk", "poisoned", "dead"],
  },
  {
    id: "alignment",
    term: "Alignment",
    termFr: "Alignement",
    definition:
      "Whether a player is Good or Evil. Good players work to identify and execute the Demon. Evil players work to keep the Demon alive until too few players remain. Alignment is separate from character — some characters can change alignment during the game.",
    definitionFr:
      "Si un joueur est Bon ou Maléfique. Les bons joueurs cherchent à identifier et exécuter le Démon. Les joueurs maléfiques cherchent à garder le Démon en vie jusqu'à ce qu'il reste trop peu de joueurs. L'alignement est distinct du personnage — certains personnages peuvent changer d'alignement en cours de partie.",
    category: "concept",
    relatedTerms: ["good", "evil", "character"],
  },
  {
    id: "alive",
    term: "Alive",
    termFr: "Vivant",
    definition:
      "A player who has not yet died during the game. Alive players can nominate, vote with full strength, and use their abilities (unless otherwise specified). Most abilities only function while the player is alive.",
    definitionFr:
      "Un joueur qui n'est pas encore mort durant la partie. Les joueurs vivants peuvent nommer, voter avec toute leur force, et utiliser leurs capacités (sauf indication contraire). La plupart des capacités ne fonctionnent que si le joueur est vivant.",
    category: "state",
    relatedTerms: ["dead", "executed", "night-kill"],
  },
  {
    id: "character",
    term: "Character",
    termFr: "Personnage",
    definition:
      "The role a player has in the game — such as Empath, Imp, or Spy. Each character belongs to a type (Townsfolk, Outsider, Minion, Demon, etc.) and has a unique ability. A player's character can sometimes change due to certain abilities.",
    definitionFr:
      "Le rôle qu'a un joueur dans la partie — tel que l'Empathe, l'Imp ou l'Espion. Chaque personnage appartient à un type (Villageois, Étranger, Sbire, Démon, etc.) et possède une capacité unique. Le personnage d'un joueur peut parfois changer à cause de certaines capacités.",
    category: "concept",
    relatedTerms: ["townsfolk", "outsider", "minion", "demon", "alignment"],
  },
  {
    id: "dead",
    term: "Dead",
    termFr: "Mort",
    definition:
      "A player who has died during the game. Dead players keep their character and alignment but lose their ability (unless it specifies otherwise). Dead players can still participate in discussions and have one remaining vote (their ghost vote) to use for the rest of the game.",
    definitionFr:
      "Un joueur qui est mort durant la partie. Les joueurs morts conservent leur personnage et leur alignement mais perdent leur capacité (sauf indication contraire). Les joueurs morts peuvent encore participer aux discussions et disposent d'un vote restant (leur vote fantôme) à utiliser pour le reste de la partie.",
    category: "state",
    relatedTerms: ["alive", "ghost-vote", "executed", "night-kill"],
  },
  {
    id: "demon",
    term: "Demon",
    termFr: "Démon",
    definition:
      "The most powerful evil character type. There is typically one Demon per game. The Demon kills at night, and the evil team wins if only two players remain alive when the Demon is not executed. If the Demon is correctly executed, the good team wins.",
    definitionFr:
      "Le type de personnage maléfique le plus puissant. Il n'y a généralement qu'un Démon par partie. Le Démon tue la nuit, et l'équipe maléfique gagne s'il ne reste que deux joueurs vivants lorsque le Démon n'est pas exécuté. Si le Démon est correctement exécuté, l'équipe bonne gagne.",
    category: "role",
    relatedTerms: ["minion", "evil", "night-kill"],
  },
  {
    id: "drunk",
    term: "Drunk",
    termFr: "Ivre",
    definition:
      "A state in which a player's ability malfunctions without them knowing it. Drunk players receive false information and their abilities do not work correctly. The Drunk outsider is permanently drunk from game start, and various abilities can cause temporary drunkenness.",
    definitionFr:
      "Un état dans lequel la capacité d'un joueur dysfonctionne sans qu'il le sache. Les joueurs ivres reçoivent de fausses informations et leurs capacités ne fonctionnent pas correctement. L'Ivrogne (outsider) est définitivement ivre dès le début de la partie, et diverses capacités peuvent causer une ivresse temporaire.",
    category: "state",
    relatedTerms: ["poisoned", "ability", "sober"],
  },
  {
    id: "evil",
    term: "Evil",
    termFr: "Maléfique",
    definition:
      "One of the two alignments in the game. Evil players (Demons and Minions) know each other's identities at the start of the game. Their goal is to keep the Demon alive until only two players remain. Evil players can lie freely about their characters.",
    definitionFr:
      "L'un des deux alignements du jeu. Les joueurs maléfiques (Démons et Sbires) se connaissent dès le début de la partie. Leur objectif est de garder le Démon en vie jusqu'à ce qu'il ne reste que deux joueurs. Les joueurs maléfiques peuvent librement mentir sur leurs personnages.",
    category: "concept",
    relatedTerms: ["good", "demon", "minion", "alignment"],
  },
  {
    id: "executed",
    term: "Executed",
    termFr: "Exécuté",
    definition:
      "When a player dies as a result of a vote during the day. Execution happens after a successful nomination — players vote, and if the majority (or plurality in some rules) votes for execution, the nominated player dies. Only one execution can happen per day.",
    definitionFr:
      "Quand un joueur meurt suite à un vote en journée. L'exécution a lieu après une nomination réussie — les joueurs votent, et si la majorité (ou pluralité selon les règles) vote pour l'exécution, le joueur nommé meurt. Une seule exécution peut avoir lieu par jour.",
    category: "mechanic",
    relatedTerms: ["nomination", "vote", "dead", "day"],
  },
  {
    id: "good",
    term: "Good",
    termFr: "Bon",
    definition:
      "One of the two alignments. Good players (Townsfolk and Outsiders) do not know each other's characters and must work together through deduction to find and execute the Demon. Good players win by correctly executing the Demon.",
    definitionFr:
      "L'un des deux alignements. Les bons joueurs (Villageois et Étrangers) ne connaissent pas les personnages des uns et des autres et doivent travailler ensemble par déduction pour trouver et exécuter le Démon. Les bons gagnent en exécutant correctement le Démon.",
    category: "concept",
    relatedTerms: ["evil", "townsfolk", "outsider", "alignment"],
  },
  {
    id: "grimoire",
    term: "Grimoire",
    termFr: "Grimoire",
    definition:
      "The Storyteller's book. The Grimoire contains all tokens — both character tokens and reminder tokens — laid out on a board that shows the Storyteller every player's character, alignment, and current state. Players never see the Grimoire directly.",
    definitionFr:
      "Le livre du Conteur. Le Grimoire contient tous les jetons — jetons de personnage et jetons de rappel — disposés sur un plateau montrant au Conteur le personnage, l'alignement et l'état actuel de chaque joueur. Les joueurs ne voient jamais le Grimoire directement.",
    category: "game",
    relatedTerms: ["storyteller", "token"],
  },
  {
    id: "minion",
    term: "Minion",
    termFr: "Sbire",
    definition:
      "A type of evil character that supports the Demon. Minions know who the Demon is, and the Demon knows who the Minions are. Minions have powerful disruptive abilities aimed at protecting the Demon or misleading the good team.",
    definitionFr:
      "Un type de personnage maléfique qui soutient le Démon. Les Sbires savent qui est le Démon, et le Démon sait qui sont les Sbires. Les Sbires ont de puissantes capacités perturbatrices visant à protéger le Démon ou à induire en erreur l'équipe bonne.",
    category: "role",
    relatedTerms: ["demon", "evil", "alignment"],
  },
  {
    id: "nomination",
    term: "Nomination",
    termFr: "Nomination",
    definition:
      "During the day, a player can nominate another player for execution. Each player can only nominate once per day, and each player can only be nominated once per day. A nomination triggers a vote. Only one nomination can result in execution per day.",
    definitionFr:
      "En journée, un joueur peut nommer un autre joueur pour l'exécution. Chaque joueur ne peut nommer qu'une fois par jour, et chaque joueur ne peut être nommé qu'une fois par jour. Une nomination déclenche un vote. Une seule nomination peut aboutir à une exécution par jour.",
    category: "mechanic",
    relatedTerms: ["vote", "execution", "day"],
  },
  {
    id: "outsider",
    term: "Outsider",
    termFr: "Étranger",
    definition:
      "A type of good-aligned character that, unlike Townsfolk, often has a negative or disruptive ability that complicates the good team's mission. Outsiders are still on the good team and win when the Demon is executed.",
    definitionFr:
      "Un type de personnage d'alignement bon qui, contrairement aux Villageois, possède souvent une capacité négative ou perturbatrice compliquant la mission de l'équipe bonne. Les Étrangers font toujours partie de l'équipe bonne et gagnent lorsque le Démon est exécuté.",
    category: "role",
    relatedTerms: ["townsfolk", "good", "alignment"],
  },
  {
    id: "poisoned",
    term: "Poisoned",
    termFr: "Empoisonné",
    definition:
      "A state in which a player's ability malfunctions — similar to drunk, but the player may or may not know they are poisoned. Poisoned players still receive information, but that information is false. Poison is typically applied by evil characters.",
    definitionFr:
      "Un état dans lequel la capacité d'un joueur dysfonctionne — similaire à ivre, mais le joueur peut être au courant ou non. Les joueurs empoisonnés reçoivent toujours des informations, mais celles-ci sont fausses. L'empoisonnement est généralement causé par des personnages maléfiques.",
    category: "state",
    relatedTerms: ["drunk", "ability", "minion"],
  },
  {
    id: "night-kill",
    term: "Night Kill",
    termFr: "Meurtre Nocturne",
    definition:
      "When a player dies at night due to Demon or Minion abilities. Night kills happen secretly, and the identity of the killer is not revealed. Night kill victims are announced at the start of the following day.",
    definitionFr:
      "Quand un joueur meurt la nuit à cause des capacités du Démon ou des Sbires. Les meurtres nocturnes se produisent secrètement, et l'identité du meurtrier n'est pas révélée. Les victimes de meurtres nocturnes sont annoncées au début du jour suivant.",
    category: "mechanic",
    relatedTerms: ["demon", "dead", "night", "day"],
  },
  {
    id: "storyteller",
    term: "Storyteller",
    termFr: "Conteur",
    definition:
      "The player who runs the game (equivalent to a game master). The Storyteller sets up the Grimoire, runs each night phase, distributes information, adjudicates rules, and gently guides the narrative. The Storyteller is impartial and not part of either team.",
    definitionFr:
      "Le joueur qui anime la partie (l'équivalent d'un maître de jeu). Le Conteur configure le Grimoire, anime chaque phase nocturne, distribue les informations, arbitre les règles et guide doucement le récit. Le Conteur est impartial et ne fait partie d'aucune équipe.",
    category: "game",
    relatedTerms: ["grimoire", "night", "token"],
  },
  {
    id: "token",
    term: "Token",
    termFr: "Jeton",
    definition:
      "The circular disc representing a character in the game. Character tokens show the character's name and artwork and are placed on the Grimoire. Players are given their character token in secret at game start. Reminder tokens are smaller tokens used by the Storyteller to track ongoing effects.",
    definitionFr:
      "Le disque circulaire représentant un personnage dans le jeu. Les jetons de personnage montrent le nom et l'illustration du personnage et sont placés dans le Grimoire. Les joueurs reçoivent leur jeton de personnage en secret au début de la partie. Les jetons de rappel sont des jetons plus petits utilisés par le Conteur pour suivre les effets en cours.",
    category: "game",
    relatedTerms: ["grimoire", "character", "storyteller"],
  },
  {
    id: "townsfolk",
    term: "Townsfolk",
    termFr: "Villageois",
    definition:
      "A type of good-aligned character that typically has a positive, investigative, or protective ability. Townsfolk are the backbone of the good team. Most information in the game comes from Townsfolk abilities.",
    definitionFr:
      "Un type de personnage d'alignement bon qui possède généralement une capacité positive, investigatrice ou protectrice. Les Villageois constituent la colonne vertébrale de l'équipe bonne. La plupart des informations dans le jeu proviennent des capacités des Villageois.",
    category: "role",
    relatedTerms: ["outsider", "good", "alignment"],
  },
  {
    id: "vote",
    term: "Vote",
    termFr: "Vote",
    definition:
      "After a nomination, all players vote simultaneously on whether to execute the nominated player. Alive players get one vote each; dead players keep one ghost vote for the rest of the game. The player with the most votes equal to or greater than half of living players is executed — or no one, if tied.",
    definitionFr:
      "Après une nomination, tous les joueurs votent simultanément pour savoir s'il faut exécuter le joueur nommé. Les joueurs vivants ont chacun un vote ; les joueurs morts conservent un vote fantôme pour le reste de la partie. Le joueur avec le plus de votes, égal ou supérieur à la moitié des joueurs vivants, est exécuté — ou personne, en cas d'égalité.",
    category: "mechanic",
    relatedTerms: ["nomination", "execution", "ghost-vote"],
  },
  {
    id: "ghost-vote",
    term: "Ghost Vote",
    termFr: "Vote Fantôme",
    definition:
      "The single vote that a dead player retains for the rest of the game. Once a dead player uses their ghost vote, they cannot vote again. Ghost votes can be a decisive factor in close elections.",
    definitionFr:
      "L'unique vote qu'un joueur mort conserve pour le reste de la partie. Une fois qu'un joueur mort a utilisé son vote fantôme, il ne peut plus voter. Les votes fantômes peuvent être un facteur décisif lors de votes serrés.",
    category: "mechanic",
    relatedTerms: ["vote", "dead"],
  },
  {
    id: "script",
    term: "Script",
    termFr: "Script",
    definition:
      "The specific list of characters used in a game. Scripts are chosen by the Storyteller before the game and define which characters are potentially in play. Published scripts (like Trouble Brewing) are carefully balanced for play experience.",
    definitionFr:
      "La liste spécifique de personnages utilisés dans une partie. Les scripts sont choisis par le Conteur avant la partie et définissent quels personnages sont potentiellement en jeu. Les scripts publiés (comme Tumulte en Brasserie) sont soigneusement équilibrés pour l'expérience de jeu.",
    category: "game",
    relatedTerms: ["storyteller", "character", "grimoire"],
  },
  {
    id: "mad",
    term: "Mad",
    termFr: "Convaincu",
    definition:
      "A player is 'mad' about something if they sincerely believe and claim it, even though it might be untrue. Some characters (like the Mutant) must be 'mad' about their own identity or face consequences. The Storyteller judges sincerity.",
    definitionFr:
      "Un joueur est 'convaincu' de quelque chose s'il le croit sincèrement et le déclare, même si cela peut être faux. Certains personnages (comme le Mutant) doivent être 'convaincus' de leur propre identité ou faire face à des conséquences. Le Conteur juge la sincérité.",
    category: "mechanic",
    relatedTerms: ["mutant", "cerenovus", "storyteller"],
  },
];

export const glossaryIconMap: Record<string, { src: string; alt: string }> = {
  alive: { src: "/assets/botc/coeur.png", alt: "Alive" },
  character: { src: "/assets/botc/wiki.bloodontheclocktower.com/Icon_investigator-3bc3af9bb4.png", alt: "Character" },
  dead: { src: "/assets/botc/crane.png", alt: "Dead" },
  demon: { src: "/assets/botc/wiki.bloodontheclocktower.com/Icon_imp-32541f1a31.png", alt: "Demon" },
  drunk: { src: "/assets/botc/wiki.bloodontheclocktower.com/Icon_drunk-5ea4cf9d12.png", alt: "Drunk" },
  evil: { src: "/assets/botc/wiki.bloodontheclocktower.com/Icon_vortox-8de40d7a89.png", alt: "Evil" },
  executed: { src: "/assets/botc/corde.png", alt: "Executed" },
  good: { src: "/assets/botc/wiki.bloodontheclocktower.com/Icon_mayor-37b17a5ea8.png", alt: "Good" },
  grimoire: { src: "/assets/botc/wiki.bloodontheclocktower.com/Icon_librarian-e466eb38b4.png", alt: "Grimoire" },
  minion: { src: "/assets/botc/wiki.bloodontheclocktower.com/Icon_scarletwoman-c5dedc4beb.png", alt: "Minion" },
  outsider: { src: "/assets/botc/wiki.bloodontheclocktower.com/Icon_recluse-cb8872b97c.png", alt: "Outsider" },
  poisoned: { src: "/assets/botc/wiki.bloodontheclocktower.com/Icon_poisoner-fd3059039e.png", alt: "Poisoned" },
  storyteller: { src: "/assets/botc/wiki.bloodontheclocktower.com/Icon_librarian-e466eb38b4.png", alt: "Storyteller" },
  token: { src: "/assets/botc/wiki.bloodontheclocktower.com/Icon_washerwoman-8b3da2bef1.png", alt: "Token" },
  townsfolk: { src: "/assets/botc/wiki.bloodontheclocktower.com/Icon_washerwoman-8b3da2bef1.png", alt: "Townsfolk" },
  vote: { src: "/assets/botc/wiki.bloodontheclocktower.com/Icon_mayor-37b17a5ea8.png", alt: "Vote" },
  "ghost-vote": { src: "/assets/botc/wiki.bloodontheclocktower.com/Icon_nightwatchman-334d67b702.png", alt: "Ghost vote" },
};

export const glossary: GlossaryTerm[] = baseGlossary.map((term) => ({
  ...term,
  icon: glossaryIconMap[term.id],
}));

export const glossaryByCategory = (terms: GlossaryTerm[]) =>
  terms.reduce<Record<string, GlossaryTerm[]>>((acc, term) => {
    if (!acc[term.category]) acc[term.category] = [];
    acc[term.category].push(term);
    return acc;
  }, {});

export const categoryLabels: Record<string, { en: string; fr: string }> = {
  state: { en: "States", fr: "États" },
  mechanic: { en: "Mechanics", fr: "Mécaniques" },
  role: { en: "Roles", fr: "Rôles" },
  concept: { en: "Concepts", fr: "Concepts" },
  game: { en: "Game Components", fr: "Composants du Jeu" },
};
