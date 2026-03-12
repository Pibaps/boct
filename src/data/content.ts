export interface ContentSection {
  id: string;
  title: string;
  titleFr: string;
  content: string;
  contentFr: string;
  subsections?: ContentSection[];
}

export const setupGuide: ContentSection[] = [
  {
    id: "prepare-script",
    title: "Prepare the Script",
    titleFr: "Préparer le Script",
    content:
      "Choose which script (set of characters) you will play with. The recommended starting script is Trouble Brewing. Place the Script sheet in the centre of the table so all players can see which characters are potentially in play.",
    contentFr:
      "Choisissez quel script (ensemble de personnages) vous utiliserez. Le script de départ recommandé est Tumulte en Brasserie. Placez la feuille de Script au centre de la table afin que tous les joueurs puissent voir quels personnages sont potentiellement en jeu.",
  },
  {
    id: "setup-storyteller",
    title: "Storyteller Preparation",
    titleFr: "Préparation du Conteur",
    content:
      "The Storyteller selects which specific characters to include based on player count. Guidelines: 5 players = 3 Townsfolk, 0 Outsiders, 1 Minion, 1 Demon. Add 2 more Townsfolk per additional 2 players, and add 1 Outsider per 2 extra players. Place character tokens in the bag face-down.",
    contentFr:
      "Le Conteur sélectionne les personnages spécifiques à inclure selon le nombre de joueurs. Directives : 5 joueurs = 3 Villageois, 0 Étrangers, 1 Sbire, 1 Démon. Ajoutez 2 Villageois par 2 joueurs supplémentaires, et 1 Étranger par 2 joueurs supplémentaires. Placez les jetons de personnage dans le sac, face cachée.",
  },
  {
    id: "distribute-tokens",
    title: "Distribute Character Tokens",
    titleFr: "Distribuer les Jetons",
    content:
      "Each player draws a character token from the bag and reads it secretly — they must not show it to other players. Players then sit in a circle and each places their token face-down in front of them. The Storyteller fills in the Grimoire with all character information.",
    contentFr:
      "Chaque joueur pioche un jeton de personnage dans le sac et le lit secrètement — il ne doit pas le montrer aux autres joueurs. Les joueurs s'assoient en cercle et chacun place son jeton face cachée devant lui. Le Conteur remplit le Grimoire avec toutes les informations sur les personnages.",
  },
  {
    id: "first-night",
    title: "First Night",
    titleFr: "Première Nuit",
    content:
      "Players close their eyes. The Storyteller wakes each character in order (following the night sheet). Evil players wake first to learn each other's identities. Then each Townsfolk and Outsider with a first-night ability is woken in sequence to receive their information.",
    contentFr:
      "Les joueurs ferment les yeux. Le Conteur réveille chaque personnage dans l'ordre (en suivant la fiche de nuit). Les joueurs maléfiques se réveillent en premier pour se reconnaître. Ensuite, chaque Villageois et Étranger avec une capacité de première nuit est réveillé séquentiellement pour recevoir ses informations.",
  },
  {
    id: "first-day",
    title: "First Day",
    titleFr: "Premier Jour",
    content:
      "Players open their eyes. The Storyteller announces any dawn deaths. Players may freely discuss, share information, and try to deduce who is evil. After a period of discussion, players may nominate others for execution. The player with the most votes (at least half of living players) is executed.",
    contentFr:
      "Les joueurs ouvrent les yeux. Le Conteur annonce les morts de l'aube. Les joueurs peuvent librement discuter, partager des informations et essayer de déduire qui est maléfique. Après une période de discussion, les joueurs peuvent nommer d'autres joueurs pour exécution. Le joueur ayant le plus de votes (au moins la moitié des joueurs vivants) est exécuté.",
  },
];

export const playerStrategy: ContentSection[] = [
  {
    id: "good-general",
    title: "General Good Team Strategy",
    titleFr: "Stratégie Générale de l'Équipe Bonne",
    content:
      "Share as much information as possible. The good team wins through shared knowledge — the more information everyone has, the better. Don't be afraid to reveal your role to trusted players. A confirmed townsfolk network is the backbone of a good team's victory.",
    contentFr:
      "Partagez autant d'informations que possible. L'équipe bonne gagne grâce à la connaissance partagée — plus tout le monde a d'informations, mieux c'est. N'ayez pas peur de révéler votre rôle à des joueurs de confiance. Un réseau de Villageois confirmés est la colonne vertébrale de la victoire de l'équipe bonne.",
    subsections: [
      {
        id: "good-info-share",
        title: "Information Sharing",
        titleFr: "Partage d'Informations",
        content:
          "Tell everyone your character and what information you've received. Even if the Spy is watching, you gain more from coordination than you risk from exposure. Call out suspicious behaviour early. Cross-reference information with other players to identify contradictions.",
        contentFr:
          "Dites à tout le monde votre personnage et les informations que vous avez reçues. Même si l'Espion observe, vous gagnez plus en coordination que vous ne risquez par l'exposition. Signalez rapidement les comportements suspects. Croisez les informations avec d'autres joueurs pour identifier les contradictions.",
      },
      {
        id: "good-trust-networks",
        title: "Building Trust",
        titleFr: "Construire la Confiance",
        content:
          "Confirm players through corroborating information. If the Chef says two evil players are adjacent, and the Empath says their neighbour is evil, they're collaborating on real information. Trust is built in chains: A confirms B, B confirms C, and so on.",
        contentFr:
          "Confirmez les joueurs grâce aux informations corroborantes. Si le Chef dit que deux joueurs maléfiques sont adjacents, et que l'Empathe dit que son voisin est maléfique, ils collaborent sur de vraies informations. La confiance se construit en chaînes : A confirme B, B confirme C, et ainsi de suite.",
      },
    ],
  },
  {
    id: "evil-general",
    title: "General Evil Team Strategy",
    titleFr: "Stratégie Générale de l'Équipe Maléfique",
    content:
      "Blend in. The evil team's greatest strength is that they know who everyone is, while the good team doesn't. Use this information asymmetry to your advantage. Claim credible Townsfolk roles with information that sounds plausible but is false.",
    contentFr:
      "Fondez-vous dans la masse. La plus grande force de l'équipe maléfique est qu'elle sait qui est qui, alors que l'équipe bonne ne le sait pas. Utilisez cette asymétrie d'information à votre avantage. Revendiquez des rôles de Villageois crédibles avec des informations qui semblent plausibles mais sont fausses.",
    subsections: [
      {
        id: "evil-bluffing",
        title: "Bluffing",
        titleFr: "Bluff",
        content:
          "Pick a character to claim before the game starts. Choose a character that's consistent with the setup — the Storyteller gives the Demon 3 character suggestions to bluff. Make sure your claimed character's information is consistent with what other players actually know.",
        contentFr:
          "Choisissez un personnage à revendiquer avant le début de la partie. Choisissez un personnage cohérent avec la configuration — le Conteur donne au Démon 3 suggestions de personnages à bluffer. Assurez-vous que les informations de votre personnage revendiqué sont cohérentes avec ce que les autres joueurs savent réellement.",
      },
      {
        id: "evil-demon",
        title: "Playing as the Demon",
        titleFr: "Jouer en tant que Démon",
        content:
          "Stay low. The Demon should blend in perfectly and avoid drawing attention. Let your Minions do the vocal work and distraction. Kill the most dangerous information-gatherers first — Empath, Fortune Teller, Undertaker are high-priority targets.",
        contentFr:
          "Restez discret. Le Démon devrait se fondre parfaitement dans la masse et éviter d'attirer l'attention. Laissez vos Sbires faire le travail vocal et la distraction. Tuez d'abord les collecteurs d'informations les plus dangereux — l'Empathe, la Diseuse de Bonne Aventure, le Croque-Mort sont des cibles prioritaires.",
      },
    ],
  },
  {
    id: "townsfolk-tips",
    title: "Townsfolk Tips",
    titleFr: "Conseils pour les Villageois",
    content:
      "Your information is valuable. Don't keep it to yourself. Even if you're poisoned or drunk, sharing what you think is your ability's result helps the group figure out inconsistencies. Be vocal and suspicious — passive townsfolk are the evil team's best friend.",
    contentFr:
      "Vos informations sont précieuses. Ne les gardez pas pour vous. Même si vous êtes empoisonné ou ivre, partager ce que vous pensez être le résultat de votre capacité aide le groupe à identifier les incohérences. Soyez vocal et suspicieux — les Villageois passifs sont les meilleurs amis de l'équipe maléfique.",
  },
  {
    id: "outsider-tips",
    title: "Outsider Tips",
    titleFr: "Conseils pour les Étrangers",
    content:
      "Your character may have a drawback, but you're still on the good team. Be honest about your outsider status, especially if the setup has fewer outsiders than expected — that's meaningful information. Don't be used as a scapegoat.",
    contentFr:
      "Votre personnage peut avoir un inconvénient, mais vous êtes quand même dans l'équipe bonne. Soyez honnête sur votre statut d'Étranger, surtout si la configuration a moins d'Étrangers que prévu — c'est une information significative. Ne vous laissez pas utiliser comme bouc émissaire.",
  },
];

export const storytellerAdvice: ContentSection[] = [
  {
    id: "running-smoothly",
    title: "Running the Game Smoothly",
    titleFr: "Animer la Partie en Douceur",
    content:
      "Keep pace. The best games have a natural rhythm — nights shouldn't drag on, and days should have enough time for meaningful discussion without becoming stale. Use a timer for nominations if the group tends to stall.",
    contentFr:
      "Maintenez le rythme. Les meilleures parties ont un rythme naturel — les nuits ne devraient pas s'éterniser, et les journées devraient avoir suffisamment de temps pour une discussion significative sans devenir monotones. Utilisez un minuteur pour les nominations si le groupe a tendance à bloquer.",
    subsections: [
      {
        id: "nighttime",
        title: "Running Nights",
        titleFr: "Animer les Nuits",
        content:
          "Have your night order sheet ready. Practice waking characters in the correct order before the game. Use consistent signals — tap players on the shoulder, use a light under the table, or a standard verbal prompt. Be discreet when waking evil players together.",
        contentFr:
          "Ayez votre fiche d'ordre nocturne prête. Entraînez-vous à réveiller les personnages dans le bon ordre avant la partie. Utilisez des signaux cohérents — tapotez les joueurs sur l'épaule, utilisez une lumière sous la table, ou une invite verbale standard. Soyez discret lorsque vous réveillez les joueurs maléfiques ensemble.",
      },
      {
        id: "daytime",
        title: "Managing the Day",
        titleFr: "Gérer la Journée",
        content:
          "Announce the dawn deaths dramatically but clearly. Give everyone a moment to react before opening discussion. As discussions wind down, prompt for nominations. Keep the energy up — your enthusiasm is contagious.",
        contentFr:
          "Annoncez les morts de l'aube de façon dramatique mais claire. Donnez à tout le monde un moment pour réagir avant d'ouvrir la discussion. Lorsque les discussions tirent à leur fin, incitez aux nominations. Maintenez l'énergie — votre enthousiasme est contagieux.",
      },
    ],
  },
  {
    id: "making-fun",
    title: "Making the Game Fun",
    titleFr: "Rendre la Partie Amusante",
    content:
      "The Storyteller's most important job is not to be a referee, but to be a game master who crafts an entertaining experience. Give the Demon enough rope to hang themselves (eventually). Let the good team feel competent. Allow evil team moments of triumph.",
    contentFr:
      "La tâche la plus importante du Conteur n'est pas d'être un arbitre, mais un maître de jeu qui crée une expérience divertissante. Donnez au Démon assez de corde pour se pendre (éventuellement). Laissez l'équipe bonne se sentir compétente. Permettez à l'équipe maléfique des moments de triomphe.",
    subsections: [
      {
        id: "balance",
        title: "Balancing Information",
        titleFr: "Équilibrer les Informations",
        content:
          "When you have discretion over what information to give (e.g., Fortune Teller false positive, or Savant facts), think about what makes the game most interesting — not what makes it hardest. Give the good team a fair shot. Give the evil team their fair chance.",
        contentFr:
          "Quand vous avez une latitude pour choisir les informations à donner (ex. faux positif de la Diseuse de Bonne Aventure, ou faits du Savant), réfléchissez à ce qui rend la partie la plus intéressante — pas la plus difficile. Donnez à l'équipe bonne une chance équitable. Donnez à l'équipe maléfique sa chance.",
      },
      {
        id: "storytelling",
        title: "The Narrative",
        titleFr: "Le Récit",
        content:
          "You are a storyteller, not just a rule-reader. Frame deaths as events: 'The morning brings silence... and then a scream.' Use the setting. Name the town. Create a sense of place. The more immersive you make it, the more players will care.",
        contentFr:
          "Vous êtes un conteur, pas seulement un lecteur de règles. Cadrez les morts comme des événements : 'Le matin apporte le silence... puis un cri.' Utilisez le cadre. Nommez la ville. Créez un sens du lieu. Plus vous le rendez immersif, plus les joueurs seront impliqués.",
      },
    ],
  },
  {
    id: "the-script",
    title: "Choosing a Script",
    titleFr: "Choisir un Script",
    content:
      "The script defines the entire game experience. Trouble Brewing is the right choice for first-time groups. Bad Moon Rising is better with experienced players who are comfortable with unpredictability. Sects & Violets is best when everyone loves deduction puzzles.",
    contentFr:
      "Le script définit toute l'expérience de jeu. Tumulte en Brasserie est le bon choix pour les groupes de première fois. Mauvaise Lune est mieux avec des joueurs expérimentés à l'aise avec l'imprévisibilité. Sectes et Violettes est idéal quand tout le monde aime les puzzles de déduction.",
  },
  {
    id: "growing-group",
    title: "Growing Your Group",
    titleFr: "Développer Votre Groupe",
    content:
      "New players should start as Townsfolk, not Outsiders or evil roles. Outsiders are meant to be misleading, and evil roles require comfort with deception. Give new players straightforward information-gathering roles so they grasp the core loop first.",
    contentFr:
      "Les nouveaux joueurs devraient commencer comme Villageois, pas comme Étrangers ou rôles maléfiques. Les Étrangers sont censés être trompeurs, et les rôles maléfiques nécessitent une aisance avec la tromperie. Donnez aux nouveaux joueurs des rôles directs de collecte d'informations pour qu'ils comprennent d'abord la boucle principale.",
  },
];

export const rules: ContentSection[] = [
  {
    id: "win-conditions",
    title: "Win Conditions",
    titleFr: "Conditions de Victoire",
    content:
      "The Good team wins if the Demon is executed during the day. The Evil team wins if the game reaches a point where only 2 players are alive and the Demon is still among them (or if a special evil win condition triggers).",
    contentFr:
      "L'équipe Bonne gagne si le Démon est exécuté pendant la journée. L'équipe Maléfique gagne si la partie atteint un point où seulement 2 joueurs sont vivants et que le Démon est encore parmi eux (ou si une condition de victoire maléfique spéciale se déclenche).",
  },
  {
    id: "game-loop",
    title: "The Game Loop",
    titleFr: "La Boucle de Jeu",
    content:
      "Blood on the Clocktower alternates between Night and Day phases. At night, characters wake in a specific order to use their abilities. During the day, players discuss, share information, and nominate players for execution. This repeats until one team wins.",
    contentFr:
      "Blood on the Clocktower alterne entre des phases Nuit et Jour. La nuit, les personnages se réveillent dans un ordre précis pour utiliser leurs capacités. En journée, les joueurs discutent, partagent des informations et nomment des joueurs pour exécution. Cela se répète jusqu'à ce qu'une équipe gagne.",
    subsections: [
      {
        id: "night-phase",
        title: "Night Phase",
        titleFr: "Phase de Nuit",
        content:
          "All players close their eyes. The Storyteller wakes characters one by one, following the night order. Each character uses their ability (or receives information). Then all players sleep, and the next night ends.",
        contentFr:
          "Tous les joueurs ferment les yeux. Le Conteur réveille les personnages un par un, en suivant l'ordre nocturne. Chaque personnage utilise sa capacité (ou reçoit des informations). Puis tous les joueurs s'endorment, et la nuit suivante commence.",
      },
      {
        id: "day-phase",
        title: "Day Phase",
        titleFr: "Phase de Jour",
        content:
          "Players open their eyes. Deaths from the night are announced. Players discuss freely for as long as the Storyteller allows. When ready, players may nominate others for execution. Each player may nominate once; each player can only be nominated once. After a vote, the player with the most votes (at least half of living players) is executed.",
        contentFr:
          "Les joueurs ouvrent les yeux. Les morts de la nuit sont annoncées. Les joueurs discutent librement aussi longtemps que le Conteur le permet. Quand vous êtes prêts, les joueurs peuvent nommer d'autres joueurs pour exécution. Chaque joueur peut nommer une fois ; chaque joueur ne peut être nommé qu'une fois. Après un vote, le joueur avec le plus de votes (au moins la moitié des joueurs vivants) est exécuté.",
      },
    ],
  },
  {
    id: "nominations-votes",
    title: "Nominations & Voting",
    titleFr: "Nominations et Votes",
    content:
      "Any alive player may nominate any other alive player. The Storyteller calls for a public vote. Players raise hands simultaneously. The nominator and nominee cannot change their minds. If the nomination achieves enough votes (≥ half living players), the nominee becomes the 'on the block' candidate. At the end of the day, ties result in no execution.",
    contentFr:
      "Tout joueur vivant peut nommer tout autre joueur vivant. Le Conteur appelle à un vote public. Les joueurs lèvent la main simultanément. Le nominateur et le candidat ne peuvent pas changer d'avis. Si la nomination obtient suffisamment de votes (≥ la moitié des joueurs vivants), le candidat devient le candidat 'sur le billot'. En fin de journée, les égalités n'aboutissent à aucune exécution.",
  },
  {
    id: "player-count",
    title: "Player Count Guide",
    titleFr: "Guide du Nombre de Joueurs",
    content:
      "5 players: 3 Townsfolk, 0 Outsiders, 1 Minion, 1 Demon. For each additional 2 players, add 2 more Townsfolk (before adding Outsiders). Add 1 Outsider every other increment. Minion count increases at 7, 10, and 13 players. A second Demon is not added.",
    contentFr:
      "5 joueurs : 3 Villageois, 0 Étrangers, 1 Sbire, 1 Démon. Pour chaque 2 joueurs supplémentaires, ajoutez 2 Villageois (avant d'ajouter des Étrangers). Ajoutez 1 Étranger toutes les deux incrémentations. Le nombre de Sbires augmente à 7, 10 et 13 joueurs. Un deuxième Démon n'est pas ajouté.",
  },
];
