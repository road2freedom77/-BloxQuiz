"use client";
import { useState, useMemo } from "react";

const CATEGORIES = [
  {
    id: "cool",
    label: "Cool Roblox Usernames",
    emoji: "⚔️",
    color: "var(--neon-blue)",
    bg: "rgba(0,212,255,0.1)",
    description: "Powerful, memorable names that command respect on any server.",
    names: [
      "ShadowBlade", "NovaKnight", "PhantomEdge", "VoidStrike", "CrimsonWolf",
      "ZenithSlayer", "StormBreaker", "IronVeil", "DarkNebula", "SilentReaper",
      "BladeRunner", "NightCrawler", "FrostBite", "ThunderClap", "ChaosReign",
      "ObsidianWolf", "NebulaRift", "GhostPhantom", "VenomStrike", "WraithBlade",
      "ColdBlood", "SteelShadow", "NightFalcon", "IronPhantom", "DarkMatter",
      "VoidWalker", "CrimsonFang", "StormChaser", "ShadowFang", "NovaStrike",
      "PhantomRift", "BlazeShadow", "NightRaider", "VoidHunter", "IceWarden",
      "SilentStorm", "GhostRider", "BloodMoon", "SteelWolf", "DarkReaper",
      "NovaBlade", "ZeroGravity", "SkyBreaker", "IronGhost", "FrostReaper",
      "ThunderWolf", "ShadowRift", "ChaosWalker", "NightBlade", "VoidReaper",
      "CrimsonStorm", "PhantomKnight", "StormRaider", "ObsidianBlade", "SilentKiller",
      "GhostWalker", "IronStrike", "DarkWarden", "NovaShadow", "ZenithKnight",
      "FrostBlade", "ThunderReaper", "ShadowHunter", "VoidKnight", "BloodRaider",
      "SteelReaper", "NightWarden", "ChaosBlaze", "PhantomStrike", "CrimsonKnight",
      "StormWalker", "ObsidianRift", "SilentBlaze", "GhostStrike", "IronRaider",
      "DarkBlaze", "NovaReaper", "ZenithRift", "FrostHunter", "ThunderKnight",
      "ShadowRaider", "VoidBlaze", "CrimsonReaper", "StormKnight", "BladeWarden",
      "NightRift", "ChaosHunter", "PhantomBlaze", "ObsidianKnight", "SilentRaider",
      "GhostHunter", "IronBlaze", "DarkKnight", "NovaHunter", "ZenithBlaze",
      "FrostRaider", "ThunderBlaze", "ShadowKnight", "VoidRaider", "CrimsonHunter",
      "StormBlaze", "BladeKnight", "NightHunter", "ChaosKnight", "PhantomRaider",
    ],
  },
  {
    id: "aesthetic",
    label: "Aesthetic Roblox Usernames",
    emoji: "🌸",
    color: "#ff9ec8",
    bg: "rgba(255,158,200,0.1)",
    description: "Soft, beautiful names with a dreamy, artistic vibe.",
    names: [
      "LunarBloom", "VelvetNova", "DreamPetal", "CelestialRose", "MoonlitSoul",
      "SilverMist", "CrystalDawn", "AuroraWisp", "PetalSoft", "StardustDream",
      "MidnightRose", "SilkMoon", "CloudPetal", "GlowingSoul", "IvoryDream",
      "LavenderMist", "PeachBloom", "AngelsWing", "SoftNova", "BlossomsEnd",
      "TwilightPetal", "DewdropSoul", "MoonflowerX", "CandyCloud", "GlitterMist",
      "RosyDawn", "SilkPetal", "CrystalMist", "AuroraBloom", "StarPetal",
      "MidnightDew", "IvorySoul", "PeachMist", "CloudDream", "GlowPetal",
      "SoftBloom", "BlossomsGlow", "TwilightMist", "DewdropDream", "MoonflowerSoft",
      "CandyPetal", "GlitterBloom", "RosyMist", "SilkDream", "CrystalBloom",
      "AuroraMist", "StarDream", "MidnightPetal", "IvoryBloom", "PeachDream",
      "CloudMist", "GlowDream", "SoftMist", "BlossomsDew", "TwilightBloom",
      "DewdropMist", "MoonflowerDream", "CandyMist", "GlitterDream", "RosyBloom",
      "SilkBloom", "CrystalDream", "AuroraPetal", "StarBloom", "MidnightBloom",
      "IvoryMist", "PeachPetal", "CloudBloom", "GlowMist", "SoftDream",
      "BlossomsPetal", "TwilightDream", "DewdropBloom", "MoonflowerMist", "CandyBloom",
      "GlitterPetal", "RosyDream", "SilkMist", "CrystalPetal", "AuroraDream",
      "StarMist", "MidnightMist", "IvoryPetal", "PetalDrift", "CloudPetal",
      "GlowBloom", "SoftPetal", "BlossomsBloom", "TwilightPetal", "DewdropPetal",
      "MoonflowerBloom", "CandyDream", "SnowblossomX", "VioletMist", "RoseEther",
      "LunarPetal", "FrostBloom", "PastelHaze", "CherryMist", "DawnRose",
    ],
  },
  {
    id: "funny",
    label: "Funny Roblox Names",
    emoji: "😂",
    color: "var(--neon-yellow)",
    bg: "rgba(255,227,71,0.1)",
    description: "Hilarious names that make everyone in the server laugh.",
    names: [
      "PotatoWarlord", "BananaMage", "ChickenLord", "ToastKnight", "WaffleSword",
      "NoodleNinja", "BurritoBlaze", "TacoStrike", "PizzaReaper", "SushiSlayer",
      "DonutDestroyer", "CookieKnight", "MuffinMage", "BagelBoss", "PretzelPro",
      "CabbageKing", "PickleWarrior", "OnionOverlord", "MushroomMaster", "BroccoliBlaze",
      "SpaghettiStrike", "RavioliRaider", "GnocchiGhost", "LasagnaLord", "PennePhantom",
      "UnicornDestroyer", "FluffyDarkLord", "CuddleReaper", "SleepyAssassin", "LazySlayer",
      "AngryToaster", "GrumpyCactus", "SassyPotato", "ChunkyMonkey", "TinyDestroyer",
      "MightyMuffin", "FerociousKitten", "DangerousDaisy", "DeadlyBunny", "FuriousPuppy",
      "ChaosNoodle", "LoudBurp", "SneezyNinja", "ClumsySword",
      "WobblyKnight", "SlipperyMage", "ConfusedWarrior", "LostPaladin", "BrokenQuest",
      "AFK_Again", "WrongButton", "OopsILied", "TryingMyBest", "NotANoob",
      "TotallySkilled", "ProGamerMoves", "CarryMePlz", "NeedMoreCoffee", "SendHelp",
      "GlitchHunter", "LagMaster", "PingOf999", "ServerCrasher", "FrameDropper",
      "BugCollector", "ErrorCode404", "LoadingPls", "BufferingForever", "CacheCleaner",
      "ThumbsOnKeyboard", "MistypedName", "FatFingers42", "CtrlZWarrior", "UndoButton",
      "SaveScummer", "QuickSaver", "PauseButton", "EscapeArtist", "SpacebarHero",
      "EnterKeyMaster", "ShiftLockKing", "CapsLockCrazy", "DeleteButton", "BackspaceWarrior",
      "TabNavigation", "ScrollWheelGod", "RightClickPro", "DoubleClicker", "DragAndDrop",
      "CopyPasteNinja", "UndoPro", "RedoWarrior", "SelectAllHero", "FindAndReplace",
      "AutoCorrectFail", "SpellCheckOff", "PunctuationKing", "EllipsisUser", "TypoMaster",
    ],
  },
  {
    id: "tryhard",
    label: "Tryhard Roblox Names",
    emoji: "💀",
    color: "var(--neon-pink)",
    bg: "rgba(255,60,172,0.1)",
    description: "Names that mean business — for players who play to win.",
    names: [
      "VoidSlayer", "ZenithStrike", "ApexKiller", "OmegaDestroyer", "AlphaReaper",
      "SigmaHunter", "DeltaStrike", "GammaBlaze", "EpsilonVoid", "ThetaKnight",
      "XxVoidSlayerxX", "xXProKillerXx", "iKillNoobs", "GodLikeSkills", "NoSkillNeeded",
      "InstantKill", "OneShot", "NoPeek", "HeadshotKing", "AimGod",
      "SpeedRunner99", "FlickShotPro", "ZeroRecoil", "PerfectAim", "FullSweep",
      "TeamWiper", "ClutchKing", "ComebackKid", "NeverDies", "InfiniteKills",
      "MaxDamage", "CriticalHit", "InstaDeath", "SwiftElim", "QuickScope",
      "NightVision", "WallBanger", "DropShot", "JigglePeak", "CounterStrike",
      "FragMaster", "ElimChain", "KillStreak", "MultiFrag", "UltraKill",
      "MegaKill", "MonsterKill", "GodlikeKill", "BeyondGodlike", "UltraInstinct",
      "UnrealKill", "WickedSick", "LudicrisSpeed", "RampageKill", "DominatingKill",
      "KillingSpree", "UnstoppableKill", "FrenzyKill", "BloodBathKill", "WarCryKill",
      "BerserkKill", "CarryHard", "SmurfAccount", "EasyGame", "GGnoRe",
      "ReportHacker", "KickNoob", "CarryTeam", "TopFragger", "MVPAlways",
      "RankOne", "TopLadder", "GlobalElite", "RadiantPlayer", "ChallengerRank",
      "ImmortalSkill", "DiamondGrind", "PlatinumPush", "GoldNoMore", "SilverSurge",
      "BronzeToGod", "UnratedToTop", "PlacementAce", "SeasonPass", "WinStreaker",
      "TiltProof", "MentallyStrong", "CalmUnderFire", "IceVeins", "NerveOfSteel",
      "ClutchOrKick", "1v5Easy", "RetakeKing", "ForceDropper", "EcoFragger",
      "FullBuyKiller", "SaveOrDie", "PlantOrDie", "DefuseGod", "TimeoutCaller",
    ],
  },
  {
    id: "girls",
    label: "Roblox Usernames for Girls",
    emoji: "👑",
    color: "#ff79c6",
    bg: "rgba(255,121,198,0.1)",
    description: "Pretty, cute and powerful names perfect for girl Roblox players.",
    names: [
      "RoyalQueen", "PrincessNova", "StarletRose", "DiamondDiva", "GoldenGlow",
      "CrystalQueen", "SapphireStar", "RubyRose", "EmeraldDream", "PearlGlow",
      "TiaraKnight", "ScepterStar", "CrownNova", "GemstoneGlow", "JewelDream",
      "ValentineRose", "CherryBlossom", "SakuraDream", "LilyGlow", "DaisyNova",
      "VioletStar", "IrisDream", "MagnoliaNova", "HyacinthGlow", "TulipRose",
      "SunflowerStar", "PoppieDream", "LotusNova", "OrchidGlow", "JasmineStar",
      "HoneyBee", "SugarPlum", "CandyFloss", "LollipopDream", "CottonCandy",
      "BubbleGum", "SweetsNova", "CupcakeQueen", "MacaronGlow", "TruffleStar",
      "GlitterGlow", "SparkleNova", "ShimmerDream", "TwinkleRose", "DazzleStar",
      "FlashGlow", "BlingNova", "ShinyDream", "LusciousRose", "RadiantStar",
      "FairyDust", "PixieDream", "ElfinNova", "SpriteGlow", "NymphStar",
      "SirenDream", "MermaidNova", "SelkieGlow", "UndineRose", "NixieStar",
      "AngelWing", "HaloGlow", "SeraphNova", "CherubDream", "DivineRose",
      "HeavenStar", "CelestialGlow", "SacredNova", "HolyDream", "BlessedRose",
      "MoonGoddess", "StarGoddess", "SunGoddess", "EarthGoddess", "SeaGoddess",
      "SkyGoddess", "NightGoddess", "DawnGoddess", "DuskGoddess", "TwilightGoddess",
      "CosmicQueen", "GalacticGlow", "NebulaNova", "StellarDream", "AstralRose",
      "OrbitalStar", "SolsticeGlow", "EquinoxNova", "ZenithDream", "NadirRose",
      "AuroraNova", "BorealisGlow", "NorthernStar", "PolarDream", "ArcticRose",
      "TropicNova", "MonsoonGlow", "CycloneStar", "TyphoonDream", "HurricaneRose",
    ],
  },
  {
    id: "boys",
    label: "Roblox Usernames for Boys",
    emoji: "🔥",
    color: "var(--neon-orange, #ff9500)",
    bg: "rgba(255,149,0,0.1)",
    description: "Strong, bold names built for boys who dominate the game.",
    names: [
      "IronFist", "SteelJaw", "BronzeBack", "CopperShield", "TitaniumEdge",
      "ChromeKnight", "TungstenBlade", "MolybdenumMage", "TantalumStrike", "VanadiumVoid",
      "BlazeRider", "FlameKnight", "EmberStrike", "ScorchBlade", "AshReaper",
      "CinderVoid", "SparkKnight", "InfernoRider", "PyreStrike", "BurnBlade",
      "ThunderBolt", "LightningRod", "StormCloud", "GaleForce", "TornadoKnight",
      "HurricaneRider", "CycloneStrike", "WhirlwindBlade", "TyphoonVoid", "MonsoonReaper",
      "AvalancheBoss", "GlacierKnight", "BlizzardRider", "SnowStrike", "IceBlade",
      "FrostVoid", "HailReaper", "SleetKnight", "FreezeBoss", "ColdSnap",
      "RockSolid", "StoneCold", "GraniteWall", "MarbleKnight", "QuartzBlade",
      "ObsidianBoss", "BasaltRider", "SlatStrike", "ShaleBlade", "LimestoneVoid",
      "BoulderCrash", "CliffEdge", "MountainTop", "PeakProwler", "SummitStrike",
      "RidgeBlade", "ValleyRaider", "PlainsProwler", "DesertStrike", "DuneBlade",
      "OasisKnight", "MirageVoid", "SandstormBoss", "DustDevil", "TumbleweedRider",
      "ForestKnight", "JungleBlade", "SwampRaider", "BogBoss", "FenVoid",
      "MarshKnight", "PeatRider", "MossStrike", "FernBlade", "ThicketVoid",
      "OceanKnight", "SeaBlade", "TideRaider", "WaveBoss", "SurfVoid",
      "CoralKnight", "ReefRider", "AbysmStrike", "TrenchBlade", "DeepVoid",
      "CosmicKnight", "NebulaBlade", "GalaxyRaider", "StarBoss", "QuasarVoid",
      "PulsarKnight", "MagnetarRider", "BlackHoleStrike", "SupernovaBlade", "DwarfVoid",
      "GiantKnight", "RedGiantRider", "NeutronStrike", "ProtonBlade", "ElectronVoid",
    ],
  },
  {
    id: "short",
    label: "Short Roblox Usernames",
    emoji: "⚡",
    color: "var(--neon-green)",
    bg: "rgba(0,245,160,0.1)",
    description: "Clean, short names under 8 characters — rare and easy to remember.",
    names: [
      "Nova", "Void", "Blaze", "Frost", "Storm",
      "Shadow", "Phantom", "Ghost", "Wraith", "Shade",
      "Flare", "Surge", "Pulse", "Flash", "Bolt",
      "Spike", "Slash", "Dash", "Rush", "Crush",
      "Zap", "Zip", "Zing", "Zoom", "Zone",
      "Apex", "Axis", "Axiom", "Axle", "Axon",
      "Byte", "Bit", "Bool", "Base", "Bash",
      "Core", "Code", "Coil", "Coin", "Cope",
      "Dark", "Dusk", "Dust", "Daze", "Dare",
      "Edge", "Echo", "Even", "Epic", "Ember",
      "Fade", "Fall", "Fast", "Fate", "Fire",
      "Glow", "Gloom", "Grid", "Grim", "Grip",
      "Haze", "Heat", "Heel", "Hero", "High",
      "Iron", "Icon", "Idle", "Iota", "Iris",
      "Jade", "Jolt", "Jump", "Just", "Jest",
      "Keen", "Kill", "King", "Knot", "Knox",
      "Lash", "Last", "Lean", "Lore", "Lost",
      "Mach", "Mark", "Meld", "Melt", "Mesh",
      "Neon", "Nite", "Node", "Noir", "Null",
      "Onyx", "Orb", "Ore", "Omen", "Opal",
    ],
  },
  {
    id: "bloxfruits",
    label: "Blox Fruits Username Ideas",
    emoji: "⚔️",
    color: "#b44cff",
    bg: "rgba(180,76,255,0.1)",
    description: "Names inspired by the world of Blox Fruits — fruits, seas, and powers.",
    names: [
      "FlameFluitUser", "IceAdmiral", "QuakeEmperor", "DarkKingBF", "LightSword",
      "SwordMasterBF", "GumGumPlayer", "MagmaLord", "PawPawStrike", "BuddhaMode",
      "RumbleKing", "GasGasUser", "SandWarlord", "LeopardFruit", "ControlFruit",
      "VenomStriker", "SpiritBlade", "MammalUser", "DragonFruitBF", "HoloFruitUser",
      "FirstSeaSword", "SecondSeaKing", "ThirdSeaLord", "NewWorldBF", "OldWorldBF",
      "RaidBoss", "SeaWarrior", "FruitHunter", "DevilFruitUser", "LogiaPower",
      "ZoanForm", "ParameciaType", "AwakeningKing", "FragmentFarm", "BellyFarmer",
      "MaskeradeUser", "TrueTripleSword", "KokoroSword", "TushitaBlade", "DualKatana",
      "FlamingSword", "IceSword", "DarkBlade", "LightBlade", "ElectricBlade",
      "MagmaBlade", "QuakeBlade", "SandBlade", "GasBlade", "VenomBlade",
      "SpeedFruitUser", "PortalFruit", "BarrierFruit", "TrapFruit", "NullFruit",
      "ShadowFruitBF", "GhostFruitBF", "VoidFruitBF", "TimeUser", "SpaceFruitBF",
      "BossHunterBF", "ChestFarmer", "StatResetter", "MirageFruitUser", "YetiHunter",
      "ElderUser", "CyborgsKing", "HybridForm", "NaturalForm", "FullBodyHaki",
      "ArmedHaki", "ObservationHaki", "KingSurge", "HakiBlast", "MusketeerBF",
      "GunslingsrBF", "KnifeUser", "ClawsUser", "TridentUser", "SpearUserBF",
      "ShieldUserBF", "GauntletUser", "SaboteurBF", "CommandoBF", "NavalBF",
      "MarineKingBF", "PirateKingBF", "WarlordBF", "RevolutionaryBF", "BountyHunterBF",
      "LowestBounty", "HighestBounty", "MaxLevel2450", "GrindingBF", "LegendBF",
      "GodhaxBF", "TrueMainBF", "AltAccountBF", "FruitNotifier", "SeaEvent",
    ],
  },
  {
    id: "og",
    label: "OG Style Roblox Names",
    emoji: "🏆",
    color: "#ffd700",
    bg: "rgba(255,215,0,0.1)",
    description: "Clean, original-style names that look like they were registered on day one.",
    names: [
      "TheRealOne", "OriginalUser", "FirstOfKind", "TrueLegend", "ActualPro",
      "RealAccount", "NotABot", "LegitPlayer", "TruePlayer", "ActualUser",
      "xXDarkXx", "xXShadowXx", "xXVoidXx", "xXNightXx", "xXPhantomXx",
      "xXGhostXx", "xXWraithXx", "xXSilentXx", "xXBladeXx", "xXStrikeXx",
      "iAmLegend", "iAmGod", "iAmKing", "iAmBoss", "iAmMaster",
      "iAmSlayer", "iAmReaper", "iAmHunter", "iAmRaider", "iAmWarrior",
      "NotBanned", "NotReported", "NotSuspended", "NotDeleted", "NotRemoved",
      "StillAlive", "StillPlaying", "StillHere", "StillGoing", "StillTrying",
      "OldAccount", "VintageUser", "ClassicPlayer", "RetroGamer", "AncientOne",
      "FounderBadge", "VeteranPlayer", "SeniorUser", "ElderGamer", "AncestorAcc",
      "NoNumbersHere", "NoUnderscores", "CleanUsername", "PureUsername", "SimpleUser",
      "OneWord", "TwoWords", "ThreeWords", "FourWords", "FiveWords",
      "NumberOne", "TopRanked", "BestPlayer", "HighestScore", "MaxStats",
      "FullyUpgraded", "MaxedOut", "CompletedGame", "AllAchievements", "PlatinumTrophy",
      "GoldMedal", "SilverMedal", "BronzeMedal", "IronMedal", "SteelMedal",
      "DiamondRank", "EmeraldRank", "SapphireRank", "RubyRank", "AmethystRank",
      "LeagueOne", "LeagueTwo", "LeagueThree", "LeagueFour", "LeagueFive",
      "DivisionOne", "DivisionTwo", "DivisionThree", "DivisionFour", "DivisionFive",
      "TierOne", "TierTwo", "TierThree", "TierFour", "TierFive",
      "ZoneOne", "ZoneTwo", "ZoneThree", "ZoneFour", "ZoneFive",
    ],
  },
  {
    id: "scary",
    label: "Scary & Horror Roblox Names",
    emoji: "💀",
    color: "#8b0000",
    bg: "rgba(139,0,0,0.1)",
    description: "Creepy, unsettling names for horror game enthusiasts and Doors players.",
    names: [
      "SeekisHere", "RushisNear", "ScreechFound", "AmbushWaiting", "HideisClose",
      "FigureWatching", "BackdoorOpen", "EntitySpawned", "GlitchHunting", "TimerExpired",
      "NightmareFuel", "DarknessInside", "ShadowLurker", "VoidCrawler", "AbyssWalker",
      "HellBound", "DamnedSoul", "CursedSpirit", "HauntedGhost", "PossessedMind",
      "BloodCurdling", "BoneChilling", "SpineTingling", "HeartStopping", "BreathTaking",
      "NerveShattering", "MindBreaking", "SoulCrushing", "WillBreaking", "SpiritBending",
      "GraveDigger", "CoffinNail", "BodySnatcher", "SoulStealer", "LifeTaker",
      "DeathBringer", "DoomBringer", "CurseBringer", "PlagueBringer", "ChaosMonger",
      "FearMonger", "DreadMonger", "HorrorMonger", "TerrorMonger", "PanicMonger",
      "CreepyCrawler", "NightCrawler", "DarkCrawler", "ShadowCrawler", "DarkLurker",
      "BloodyMary", "SlenderWalks", "JeffTheKnight", "JaneTheReaper", "BenDrowning",
      "SCP173", "SCP096", "SCP049", "SCP682", "SCP2399",
      "Enderman", "HerobrineSees", "NullAndVoid", "EntityUnknown", "ErrorEntity",
      "GlitchEntity", "CorruptEntity", "BrokenEntity", "HackedEntity", "DeletedEntity",
      "Room000", "Room666", "RoomMinus1", "BackroomsLevel", "LiminalSpace",
      "WetCarpetSmell", "HummingNoise", "InfiniteHalls", "NoExit", "WallsClosing",
      "EyesInDark", "FootstepsBehind", "BreathOnNeck", "HandOnShoulder", "TapOnGlass",
      "KnockAtDoor", "BellAtMidnight", "ClockAt3AM", "PhoneCallDead", "MessageFromBeyond",
      "LastWords", "FinalBreath", "DeathRattle", "FlatLine", "CodeBlue",
      "BlackTag", "ZeroHeart", "NoPulse", "BrainDead", "LightsOut",
    ],
  },
  {
    id: "display",
    label: "Roblox Display Name Ideas",
    emoji: "✨",
    color: "var(--neon-blue)",
    bg: "rgba(0,212,255,0.08)",
    description: "Display names can have spaces and special characters — get creative.",
    names: [
      "Shadow Blade", "Nova Knight", "Void Walker", "Frost Reaper", "Storm Chaser",
      "Dark Matter", "Phantom Edge", "Crimson Wolf", "Steel Shadow", "Night Falcon",
      "Lunar Bloom", "Velvet Nova", "Dream Petal", "Crystal Dawn", "Aurora Wisp",
      "Silver Mist", "Stardust", "Midnight Rose", "Silk Moon", "Cloud Petal",
      "Potato Warlord", "Banana Mage", "Toasted Knight", "Waffle Sword", "Noodle Ninja",
      "Void Slayer", "Zenith Strike", "Apex Killer", "Omega Reaper", "Alpha Hunter",
      "Royal Queen", "Princess Nova", "Diamond Diva", "Crystal Queen", "Sapphire Star",
      "Iron Fist", "Steel Jaw", "Blaze Rider", "Thunder Bolt", "Rock Solid",
      "The Nova", "The Void", "The Shadow", "The Storm", "The Frost",
      "im nova", "im void", "im shadow", "im storm", "im frost",
      "just nova", "just void", "just shadow", "just storm", "just frost",
      "only nova", "only void", "only shadow", "only storm", "only frost",
      "nova vibes", "void vibes", "shadow vibes", "storm vibes", "frost vibes",
      "nova mode", "void mode", "shadow mode", "storm mode", "frost mode",
      "nova era", "void era", "shadow era", "storm era", "frost era",
      "nova szn", "void szn", "shadow szn", "storm szn", "frost szn",
      "nova fc", "void fc", "shadow fc", "storm fc", "frost fc",
      "nova gang", "void gang", "shadow gang", "storm gang", "frost gang",
      "go nova", "go void", "go shadow", "go storm", "go frost",
      "its nova", "its void", "its shadow", "its storm", "its frost",
    ],
  },
];

const TOTAL = CATEGORIES.reduce((sum, c) => sum + c.names.length, 0);

export default function UsernameIdeasClient() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredCategories = useMemo(() => {
    if (activeCategory !== "all") {
      const cat = CATEGORIES.find(c => c.id === activeCategory);
      if (!cat) return [];
      const filtered = search
        ? cat.names.filter(n => n.toLowerCase().includes(search.toLowerCase()))
        : cat.names;
      return [{ ...cat, names: filtered }];
    }
    if (!search) return CATEGORIES;
    return CATEGORIES.map(cat => ({
      ...cat,
      names: cat.names.filter(n => n.toLowerCase().includes(search.toLowerCase())),
    })).filter(cat => cat.names.length > 0);
  }, [search, activeCategory]);

  const totalFiltered = filteredCategories.reduce((sum, c) => sum + c.names.length, 0);

  function copyName(name: string) {
    navigator.clipboard.writeText(name).then(() => {
      setCopied(name);
      setTimeout(() => setCopied(""), 1500);
    });
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" style={{ marginBottom: 20 }}>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", fontSize: 13, fontWeight: 700, color: "var(--text-dim)" }}>
          <li><a href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</a></li>
          <li>›</li>
          <li style={{ color: "var(--text)" }}>Roblox Username Ideas</li>
        </ol>
      </nav>

      {/* Hero */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 52px)", marginBottom: 12, lineHeight: 1.1 }}>
          {TOTAL.toLocaleString()}+ Roblox Username Ideas
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, maxWidth: 700, marginBottom: 24 }}>
          Finding the perfect Roblox username is hard — especially when everything seems taken. Browse our massive list of cool, aesthetic, funny, tryhard, and themed username ideas. Click any name to copy it instantly.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Total Names", value: TOTAL.toLocaleString(), color: "var(--neon-blue)" },
            { label: "Categories", value: CATEGORIES.length, color: "var(--neon-green)" },
            { label: "Free to Use", value: "100%", color: "var(--neon-yellow)" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "12px 20px", textAlign: "center", minWidth: 80 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color, marginBottom: 2 }}>{value}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + Filter */}
      <div style={{ marginBottom: 32, display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="text"
          placeholder="🔍 Search username ideas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", maxWidth: 500, padding: "14px 18px", fontSize: 15, fontWeight: 600,
            background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
            color: "var(--text)", outline: "none", boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveCategory("all")}
            style={{
              padding: "8px 16px", borderRadius: 100, fontSize: 12, fontWeight: 800, cursor: "pointer",
              background: activeCategory === "all" ? "var(--gradient-main)" : "var(--surface)",
              color: activeCategory === "all" ? "var(--bg)" : "var(--text-muted)",
              border: "1px solid var(--border)", WebkitTextFillColor: activeCategory === "all" ? "var(--bg)" : undefined,
            }}
          >
            All ({TOTAL})
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: "8px 16px", borderRadius: 100, fontSize: 12, fontWeight: 800, cursor: "pointer",
                background: activeCategory === cat.id ? cat.bg : "var(--surface)",
                color: activeCategory === cat.id ? cat.color : "var(--text-muted)",
                border: `1px solid ${activeCategory === cat.id ? cat.color : "var(--border)"}`,
              }}
            >
              {cat.emoji} {cat.label.split(" ")[0]} ({cat.names.length})
            </button>
          ))}
        </div>
        {search && (
          <p style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600 }}>
            Found {totalFiltered} names matching "{search}"
          </p>
        )}
      </div>

      {/* Tip box */}
      <div style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "var(--radius-sm)", padding: "16px 20px", marginBottom: 40, fontSize: 13, fontWeight: 600, color: "var(--text-muted)", lineHeight: 1.7 }}>
        💡 <strong style={{ color: "var(--text)" }}>Pro tip:</strong> Roblox usernames are 3–20 characters, letters/numbers/underscores only, can't start with underscore or number. Display names can have spaces and are free to change every 7 days. Usernames cost 1000 Robux to change.
      </div>

      {/* Name sections */}
      {filteredCategories.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)", fontWeight: 700 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>No names found</div>
          <div>Try a different search term</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {filteredCategories.map(cat => (
            <section key={cat.id}>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, padding: "3px 12px", borderRadius: 100, background: cat.bg, color: cat.color, fontFamily: "inherit" }}>
                    {cat.names.length}
                  </span>
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
                {cat.names.map(name => (
                  <button
                    key={name}
                    onClick={() => copyName(name)}
                    style={{
                      background: copied === name ? cat.bg : "var(--bg-card)",
                      border: `1px solid ${copied === name ? cat.color : "var(--border)"}`,
                      borderRadius: "var(--radius-sm)",
                      padding: "10px 14px",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700, color: copied === name ? cat.color : "var(--text)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {name}
                    </span>
                    <span style={{ fontSize: 11, color: copied === name ? cat.color : "var(--text-dim)", fontWeight: 800, flexShrink: 0 }}>
                      {copied === name ? "✓" : "copy"}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* SEO content section */}
      <div style={{ marginTop: 64, display: "flex", flexDirection: "column", gap: 32 }}>
        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>How to Pick the Perfect Roblox Username</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>
            Your Roblox username is your identity across every game, server, and friend list. Unlike your display name, your username is permanent unless you spend 1000 Robux to change it — so it's worth taking time to choose wisely. A great Roblox username should be easy to remember, reflect your personality or playstyle, and ideally be short enough that other players can type it quickly when wanting to add you as a friend.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>Roblox Username Rules</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>
            Before you try to register a username, make sure it follows Roblox's rules. Usernames must be between 3 and 20 characters long. You can use letters (A–Z), numbers (0–9), and underscores (_), but your username cannot start with an underscore or a number. Usernames are not case-sensitive, so "NovaKnight" and "novaknight" are the same username. Roblox also filters out inappropriate words, so avoid anything offensive.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>Username vs Display Name — What's the Difference?</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>
            Your Roblox <strong style={{ color: "var(--text)" }}>username</strong> is your permanent account identifier — it appears in your profile URL and costs 1000 Robux to change. Your <strong style={{ color: "var(--text)" }}>display name</strong> is what other players see above your character in-game, and you can change it for free every 7 days. Display names can include spaces and are up to 20 characters. Many players use a solid short username and get creative with their display name.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>Tips for Finding an Available Roblox Username</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>
            With over 200 million Roblox accounts, finding an available username can be tough. Try adding numbers, underscores, or extra letters to your desired name — "NovaKnight2", "Nova_Knight", or "NovaaKnight" might all be available. Combining two words together often works well. Avoid very common words alone as they're almost certainly taken. Adding "x" or "xx" around a name is a classic approach. The shorter and simpler the name you want, the harder it will be to find — but our short names list above has plenty of ideas to get you started.
          </p>
        </section>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "32px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎮</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>Ready to Test Your Roblox Knowledge?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 20px" }}>
            Now that you have your perfect username, put your game knowledge to the test with our free Roblox trivia quizzes. Earn XP, climb the leaderboard, and win Robux gift cards!
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/browse" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
              🎯 Take a Quiz
            </a>
            <a href="/leaderboard" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none" }}>
              🏆 View Leaderboard
            </a>
          </div>
        </div>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16 }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { q: "How many characters can a Roblox username be?", a: "Roblox usernames must be between 3 and 20 characters long. They can contain letters, numbers, and underscores, but cannot start with an underscore or number." },
              { q: "Can I use spaces in a Roblox username?", a: "No — Roblox usernames cannot contain spaces. However, your display name (which other players see in-game) can include spaces. Display names can be changed for free every 7 days." },
              { q: "How much does it cost to change a Roblox username?", a: "Changing your Roblox username costs 1000 Robux. This is why it's important to choose a username you'll be happy with long-term. Your display name, however, is free to change every 7 days." },
              { q: "What makes a good Roblox username?", a: "A good Roblox username is easy to remember, reflects your personality or playstyle, and is short enough for other players to type easily. Avoid numbers and underscores if possible for a cleaner look." },
              { q: "Are these Roblox usernames taken?", a: "We can't guarantee any specific username is available — with 200M+ accounts, popular names are often taken. Use our list as inspiration and try variations like adding numbers, underscores, or extra letters until you find one that's available." },
            ].map((faq, i) => (
              <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "18px 22px" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>{faq.q}</div>
                <div style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}