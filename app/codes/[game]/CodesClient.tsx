"use client";
import { useState } from "react";
import RobuxCTA from "../../components/RobuxCTA";
import FollowButton from "../../components/FollowButton";

const gameTips: Record<string, string> = {
  "blox-fruits": "Most Blox Fruits codes provide double experience boosts or stat resets. Players typically redeem XP boost codes while grinding levels or completing sea quests to maximize efficiency. Because codes expire quickly — often within days of release — it's best to redeem them immediately after they are announced on the developer's Twitter or Discord.",
  "adopt-me": "Adopt Me codes typically reward free Bucks, which can be spent on eggs and pets. Redeem codes as soon as they are released since they often expire during or shortly after the event they were created for. Follow the Adopt Me Twitter account for the fastest code announcements.",
  "murder-mystery-2": "Murder Mystery 2 codes typically reward free knives and cosmetic items. Codes are released during seasonal events, collaborations, and game milestones. Because MM2 codes expire fast, redeem them immediately when announced on the developer's social media.",
  "grow-a-garden": "Grow a Garden codes give players seeds, fertilizer, and tools to accelerate garden growth. Codes are typically released with major updates and seasonal events. Redeem them quickly as they often have limited use counts.",
  "brookhaven-rp": "Brookhaven RP codes give players free items and vehicles for roleplay. New codes are released during updates and special events. Follow the Brookhaven Twitter account to catch codes before they expire.",
  "tower-of-hell": "Tower of Hell codes reward modifiers and rings that change how the tower plays. Codes drop during special events and community milestones. Redeem them quickly as they often expire within days.",
  "royale-high": "Royale High codes give players free diamonds to spend on accessories and seasonal items. Codes are typically tied to seasonal events and collaborations. Follow Royale High's social media for the fastest announcements.",
  "doors": "Doors codes reward free Knobs used in the in-game shop. New codes typically drop alongside major floor and entity updates. Redeem them fast — Doors codes often expire within a week of release.",
  "arsenal": "Arsenal codes give players free skins and Bucks for cosmetic customization. Codes are released during seasonal events and collaborations. Redeem them quickly as Arsenal codes often expire without warning.",
  "anime-fighting-simulator": "Anime Fighting Simulator codes give players Chikara Shards and Yen to power up their character faster. Codes release alongside major content updates. Redeem immediately as they often expire within days.",
  "berry-avenue": "Berry Avenue codes give players free cash and items for roleplay. New codes drop during updates and events. Follow Berry Avenue's social media to catch codes before they expire.",
  "livetopia": "Livetopia codes reward coins and items for your virtual world experience. Codes are released with updates and seasonal events. Redeem them quickly as availability is often limited.",
  "natural-disaster-survival": "Natural Disaster Survival codes reward badges and special items. Codes are released during game milestones and special events. Redeem them fast as they often have a limited redemption window.",
  "anime-defenders": "Anime Defenders codes give players free gems for summons and upgrades. New codes release alongside major unit updates and milestones. Because gems are valuable for progression, redeem codes as soon as they are announced.",
  "funky-friday": "Funky Friday codes reward free points to unlock songs and cosmetics. Codes drop during collaborations and community milestones. Redeem them quickly as Funky Friday codes often expire within a few days.",
  "kick-off": "Kick Off codes give players free coins and skins for customization. Codes are released during tournaments and updates. Follow Kick Off's social channels to catch new codes as soon as they drop.",
  "fisch": "Fisch codes typically reward free coins and bait to help you progress faster. Redeem codes as soon as they are released since they often expire within days. Follow the Fisch developers on Twitter/X and join the Discord for the fastest code announcements.",
  "3008": "3008 codes are released sporadically by the developer through the official Discord and social media channels, typically rewarding in-game currency and cosmetic items. Since this horror game has an active community, codes can expire quickly, so it's best to redeem them immediately upon discovery. Join the official Discord server to get notified of new codes before they become invalid.",
  "99-nights-in-the-forest": "99 Nights in the Forest codes are typically released through the game's official social media channels and Discord community during updates and special events. These codes usually reward survival essentials like in-game currency, exclusive cosmetics, and helpful items that improve your forest exploration experience. Redeem codes promptly as they often have limited availability windows and may expire after a few weeks.",
  "all-star-tower-defense": "All Star Tower Defense codes are released by developers through their official social media channels and Discord server to celebrate milestones, updates, and events. These codes typically reward in-game currency, cosmetics, and exclusive units that boost your tower-building strategy. Redeem codes promptly as they often expire within a few weeks, and always check the game's announcements for the latest releases.",
  "anime-battlegrounds-x": "Anime Battlegrounds X releases codes during updates, collaborations, and special events to reward active players. These codes typically grant in-game currency, rare characters, or exclusive items that enhance your progression. Redeem codes immediately upon discovery since they often have expiration dates ranging from days to weeks, and check the official social media and Discord server for the latest releases.",
  "anime-dimensions-simulator": "Anime Dimensions Simulator releases codes periodically through their social media accounts and in-game announcements, typically rewarding players with currency, boosts, and cosmetics. Codes expire after a set period, so redeem them immediately when discovered to avoid missing out on free rewards. Join the game's official Discord and follow their social media to catch new codes before they become invalid.",
  "anime-impact-simulator": "Anime Impact Simulator codes are released periodically by developers through their social media channels and official Discord server, typically rewarding currency, cosmetics, and stat boosts. These codes have expiration dates that vary, so it's crucial to redeem them as soon as possible to avoid missing out on free rewards. Check back frequently and follow official announcements to catch new codes before they expire.",
  "anime-story": "Anime Story codes are typically released by the developers on their social media accounts and official Discord server to celebrate milestones, events, and game updates. These codes usually reward players with in-game currency, cosmetics, and experience boosters that help accelerate progression. Redeem codes immediately upon discovery since they often have expiration dates ranging from a few days to a few weeks.",
  "anime-vanguards": "Anime Vanguards codes are typically released by the developers on their official social media accounts and Discord server to celebrate milestones, updates, and special events. These codes usually reward in-game currency, unit fragments, and cosmetic items that help accelerate your progression through waves. Redeem codes immediately upon finding them, as they often expire within weeks and have limited redemption counts that can run out quickly.",
  "arm-wrestle-simulator": "Arm Wrestle Simulator codes are typically released by the developer on the game's official social media channels and Discord server when milestones are reached or events occur. These codes usually grant in-game currency, cosmetics, or temporary boosts to help you progress faster in arm wrestling competitions. Redeem codes promptly as they often have expiration dates, and join the community Discord to stay updated on the latest releases before they expire.",
  "attack-on-titan-revolution": "Attack on Titan Revolution codes are released during game updates, special events, and through the official Discord server. These codes typically reward players with in-game currency, cosmetics, and experience boosters that accelerate progression. Redeem codes immediately upon discovery since they often expire within a few weeks, and always check the official announcement channels to stay informed about new releases.",
  "barrys-prison-run": "BARRY'S PRISON RUN! codes are released periodically through the game's official social media accounts and Discord server, typically rewarding players with cash, cosmetics, and gameplay boosts. These codes often expire within weeks, so it's crucial to redeem them promptly by entering them in the in-game code redemption menu. Following the official channels and redeeming codes immediately ensures you don't miss out on valuable progression rewards.",
  "bedwars": "BedWars codes are typically released during major updates, seasonal events, and special celebrations by the developers. These codes usually reward cosmetic items like weapon skins, character skins, and emotes that enhance your in-game appearance. Since codes expire after a set period, redeem them immediately when discovered to secure limited-time rewards before they become invalid.",
  "bee-swarm-simulator": "Bee Swarm Simulator codes are released by the developers across Twitter, Discord, and in-game announcements to celebrate milestones and updates. These codes typically reward honey, bee eggs, royal jelly, and other valuable progression items that accelerate your beekeeping journey. Redeem codes immediately upon discovery since they often expire within weeks, and always check the official channels frequently to avoid missing limited-time rewards.",
  "blade-ball": "Blade Ball codes are released by developers through social media announcements and Discord, typically rewarding in-game currency and cosmetic items. These codes have expiration dates that can range from days to weeks, so it's crucial to redeem them promptly when announced. Follow the official Blade Ball social channels and join their community Discord to catch codes before they expire and maximize your rewards.",
  "blue-lock-rivals": "Blue Lock: Rivals codes are typically released during new season updates, special events, and milestone celebrations announced on the official social media channels. These codes reward in-game currency, exclusive player cards, and cosmetic items that enhance your team's performance and appearance. Redeem codes immediately upon discovery since they often expire within weeks, and always check the game's announcements regularly to avoid missing limited-time opportunities.",
  "break-in": "Break In codes are typically released during major game updates and special events throughout the season. These codes usually reward in-game currency, cosmetics, and exclusive items that enhance your horror experience. Redeem codes immediately upon discovery since they often expire within weeks, and always check the official Discord and social media channels for the latest releases before they become invalid.",
  "build-a-boat-for-treasure": "Build A Boat For Treasure codes are released by the developers during updates and special events, primarily rewarding in-game currency and cosmetic items. These codes typically expire within a few weeks, so redeeming them promptly is essential to avoid missing out. Check the official game announcements and social media channels regularly to catch new codes before they become invalid.",
  "camping": "Camping codes are typically released by the developer through their official Discord server and social media announcements, often coinciding with game updates or milestones. These codes generally reward cosmetic items, in-game currency, or exclusive camping gear to enhance your horror experience. Redeem codes promptly upon release since they often have limited validity periods and may expire within weeks.",
  "car-dealership-tycoon": "Car Dealership Tycoon codes are typically released by the developer on their social media accounts and Discord server, rewarding players with in-game currency and exclusive cosmetics. These codes often expire within a few weeks, so it's crucial to redeem them promptly through the in-game code redemption menu. Bookmark this page and check back frequently to ensure you don't miss limited-time rewards that can significantly boost your business growth.",
  "clicker-simulator-x": "Clicker Simulator X codes are released regularly by the developer through the game's Discord server and social media channels, typically rewarding currency, boosts, and exclusive cosmetics. Most codes expire after a few weeks, so it's essential to redeem them promptly to avoid missing out. Join the official community channels and check back frequently to catch new codes before they become invalid.",
  "creatures-of-sonaria": "Creatures of Sonaria codes are released during updates, milestones, and special events by the developers on their social media channels. These codes typically reward cosmetic items, creature skins, and in-game currency to enhance your roleplay experience. Redeem codes immediately upon discovery since they often expire within weeks, and always check the official Discord server for the latest active codes.",
  "da-hood": "Da Hood codes are typically released through the game's official Discord server and Twitter account during updates and special events. These codes usually reward in-game currency, cosmetic items, and exclusive accessories that help you stand out in the streets. Redeem codes immediately upon discovery since they often expire within weeks, and always check the official channels to avoid expired or fake codes.",
  "dandys-world": "Dandy's World codes are released during updates and special events by the developers, typically rewarding cosmetics and in-game currency. These codes expire after a few weeks, so redeem them promptly through the settings menu. Follow the official Dandy's World social media accounts and Discord server to catch codes before they become invalid.",
  "demon-slayer-rpg-2": "Demon Slayer RPG 2 codes are typically released during game updates, new season launches, and special events, rewarding players with in-game currency, experience boosters, and cosmetic items. These codes usually expire within 1-2 weeks, so redeem them immediately upon discovery to avoid missing out. Following the official Demon Slayer RPG 2 social media accounts and Discord server ensures you catch codes before they become invalid.",
  "deepwoken": "Deepwoken codes are released through the official Discord server and social media channels, typically rewarding in-game currency, cosmetics, and battle pass progression. These codes have varying expiration dates, so it's crucial to redeem them promptly upon discovery. Join the community Discord and follow official announcements to catch codes before they expire and maximize your rewards.",
  "dragon-adventures": "Dragon Adventures codes are typically released during updates, special events, and milestones, often shared across the game's social media channels and Discord server. These codes usually reward players with in-game currency, eggs, or exclusive cosmetics to enhance their dragon collection. Redeem codes promptly as they often expire within weeks, so check for new codes frequently to maximize your rewards before they become invalid.",
  "dress-to-impress": "Dress to Impress codes are released by developers through social media announcements and community events, typically rewarding exclusive clothing items and cosmetics to enhance your wardrobe. These codes often expire within a few weeks, so redeem them immediately when announced to secure limited-edition outfits before they become unavailable. Follow the official social channels and join the community Discord to catch code releases before they expire.",
  "driving-empire": "Driving Empire codes are released periodically by the developers through their official social media accounts and Discord server, typically rewarding in-game currency and vehicle cosmetics. These codes expire after a set period, so it's important to redeem them promptly to avoid missing out on free rewards. Check the game's announcements regularly and follow their social channels to catch new codes before they become invalid.",
  "evade": "Evade codes are typically released during updates, special events, and on the developer's social media channels. They commonly reward in-game currency and cosmetic items to enhance your survivor experience. Redeem codes immediately upon discovery since they often expire after a few weeks, so follow the official Evade updates closely to avoid missing out on exclusive rewards.",
  "fish-it": "Fish It! codes are released through the official Discord server and social media channels, typically rewarding players with in-game currency, cosmetics, and experience boosters. These codes expire after a set period, so redeem them promptly by visiting the settings menu to claim your rewards before they become invalid.",
  "flee-the-facility": "Flee the Facility codes are released by the developers through their official social media channels and Discord server, typically rewarding players with in-game currency and cosmetic items. These codes have expiration dates that vary, so it's crucial to redeem them as soon as they're announced to avoid missing out on free rewards. Join the official community channels and enable notifications to catch codes before they expire.",
  "forsaken": "Forsaken codes are typically released through the official Discord server and social media channels, rewarding players with in-game currency, cosmetics, and special items. Developers often release codes during updates, events, and milestone celebrations, so joining the community Discord is essential for staying informed. Redeem codes immediately upon discovery as they frequently expire within weeks, and some codes may have limited redemption caps.",
  "fruit-battlegrounds": "Fruit Battlegrounds codes are released by developers through official announcements and social media channels, typically rewarding players with Beli (in-game currency), XP boosts, and exclusive cosmetics. These codes have expiration dates that vary, so it's crucial to redeem them as soon as you see them posted to avoid missing out on free rewards. Check the game's Discord server and follow official accounts regularly to catch new codes before they expire.",
  "ghost-simulator": "Ghost Simulator codes are typically released during game updates and special events on the developer's social media channels. These codes usually reward players with in-game currency, cosmetics, and experience boosters to accelerate ghost hunting progression. Redeem codes promptly as they often expire within a few weeks, and always check the official Discord or Twitter for the latest releases.",
  "grand-piece-online": "Grand Piece Online codes are released periodically through the official Discord server and social media channels, typically rewarding Beli (currency), experience boosters, and cosmetic items. Codes expire after a set period, so redeem them immediately when discovered to avoid missing out on valuable progression rewards. Join the community Discord and follow official announcements to catch codes before they become invalid.",
  "heroes-world": "Heroes World codes are typically released during events, updates, and special occasions through the official social media channels and Discord server. These codes reward players with in-game currency, cosmetics, and experience boosters to accelerate progression. Redeem codes immediately upon discovery since they often expire within weeks, and always check the game's announcements regularly to catch limited-time offers before they become invalid.",
  "house-tycoon": "House Tycoon codes are released periodically through the game's official social media channels and community announcements. These codes typically reward in-game currency, building materials, and cosmetic items to accelerate your property empire growth. Redeem codes promptly as they often expire within weeks, so check back frequently and join the community Discord to catch new releases before they become inactive.",
  "hypershot": "Hypershot codes are typically released through the game's official social media channels and Discord server to celebrate updates, milestones, and special events. These codes usually reward players with in-game currency, cosmetic weapon skins, and exclusive character customization items that enhance their arsenal. Redeem codes promptly upon release, as they often expire within weeks and are frequently limited to a certain number of uses before becoming invalid.",
  "islands": "Islands codes are released by the developers through their official social media channels and Discord server, typically rewarding players with resources like cash, seeds, and building materials to accelerate progression. These codes usually expire after a few weeks, so it's important to redeem them promptly through the in-game codes menu. Following the official Islands social media accounts is the best strategy to catch new codes before they expire.",
  "jujutsu-infinite": "Jujutsu Infinite codes are released through the official Discord server and social media channels, typically rewarding Yen currency, Skill Points, and cosmetic items. These codes have expiration dates that vary, so redeem them immediately upon discovery to avoid missing out on valuable progression resources. Joining the community Discord is essential to catch new codes before they expire.",
  "jujutsu-shenanigans": "Jujutsu Shenanigans releases codes during updates, milestones, and special events, typically rewarding players with in-game currency and cosmetics. These codes expire after a set period, so it's crucial to redeem them promptly through the in-game code menu. Following the game's official social media accounts ensures you catch codes before they become unavailable.",
  "kaiju-universe": "Kaiju Universe codes are released by developers on their social media channels and Discord server to celebrate updates, milestones, and special events. These codes typically reward in-game currency, cosmetic skins, and exclusive items that enhance your kaiju's appearance and power. Redeem codes immediately upon discovery since they often expire within weeks, and always check the official Discord for the latest code announcements.",
  "king-legacy": "King Legacy codes are released by developers through their official social media channels and Discord server, typically rewarding in-game currency, experience boosts, and cosmetic items. These codes often have expiration dates ranging from a few days to weeks, so it's crucial to redeem them promptly to avoid missing out. Follow the game's official announcements and join community groups to stay updated on new code releases before they expire.",
  "lumber-tycoon-2": "Lumber Tycoon 2 codes are released periodically by the developer through the game's Discord server and social media channels, typically rewarding in-game currency and cosmetic items. These codes have expiration dates that vary, so it's crucial to redeem them as soon as you discover them to avoid missing out. Join the official community channels and check back regularly to catch new codes before they expire.",
  "meep-city": "MeepCity codes are typically released during special events, seasonal updates, and the developer's livestreams, often rewarding in-game currency and cosmetic items. These codes expire relatively quickly after announcement, sometimes within days or weeks, so it's crucial to redeem them immediately when discovered. The best strategy is to follow the official MeepCity social media accounts and join community Discord servers to catch code announcements before they become invalid.",
  "murder-party": "Murder Party codes are typically released during special events, seasonal updates, and milestone celebrations announced on the official social media accounts. These codes generally reward cosmetic items like character skins, weapon skins, and in-game currency to enhance your detective or murderer experience. Redeem codes promptly through the game's code redemption menu, as they often expire within weeks to maintain exclusivity.",
  "muscle-legends": "Muscle Legends codes are released periodically through the game's official social media channels and announcements, typically rewarding players with in-game currency and boost items to accelerate muscle growth and progression. These codes expire after a set period, so it's important to redeem them promptly through the settings menu. The best strategy is to follow the game's social media accounts and check for new codes regularly, as they often coincide with game updates or milestone celebrations.",
  "my-restaurant": "My Restaurant codes are typically released during game updates, milestones, and special events announced on the developer's social media. These codes usually reward in-game currency, cosmetics, and various multipliers to boost your restaurant progression. Redeem codes immediately upon discovery since they often have expiration dates and limited-use restrictions.",
  "my-supermarket": "My Supermarket codes are typically released through the game's official social media channels and Discord server, rewarding players with currency, cosmetics, and gameplay boosters. These codes have expiration dates that vary widely, so it's essential to redeem them as soon as you discover them to avoid missing out. Check back regularly after updates and special events, as new codes are often distributed to celebrate milestones or seasonal promotions.",
  "ninja-legends": "Ninja Legends codes are released periodically through the official Roblox group and social media channels, typically rewarding players with Spins, Gems, and Boosts to accelerate progression. These codes expire after a set period, so redeem them as soon as possible upon discovery to secure your rewards before they become invalid.",
  "obby-but-youre-on-a-bike": "Codes for Obby But You're on a Bike are typically released by the developer on their social media accounts and Discord server to celebrate milestones or updates. These codes usually reward cosmetic bike skins, wheelies, and in-game currency to customize your riding experience. Redeem codes promptly upon discovery since they often expire after a few weeks, and always check the game's official channels for the most current active codes.",
  "pet-simulator-99": "Pet Simulator 99 codes are typically released during updates, events, and on the game's social media channels, rewarding players with gems, coins, and exclusive pets. These codes have expiration dates that vary, so it's crucial to redeem them as soon as possible to avoid missing out on valuable rewards. The best strategy is to follow the official Pet Simulator 99 social accounts and check community Discord servers regularly for the latest active codes.",
  "pet-simulator-x": "Pet Simulator X codes are released periodically through the official Discord server and social media channels, typically rewarding exclusive pets, gems, and coins to boost your collection. Codes expire after a set period, so redeem them as soon as possible to avoid missing out on valuable rewards. Join the community Discord and follow official announcements to stay updated on new code releases.",
  "piggy": "Piggy codes are released by the developers through their social media channels and official Discord server, primarily rewarding cosmetic skins and in-game currency. These codes typically expire within a few weeks, so it's crucial to redeem them promptly by entering them in the main menu code section. Following the official Piggy social accounts ensures you catch new codes before they become invalid.",
  "pls-donate": "PLS DONATE codes are released periodically through the game's official social media accounts and community Discord server. These codes typically reward Giftbux and exclusive cosmetic items and exclusive cosmetic items like hats, accessories, and clothing. Redeem codes immediately upon release since they often expire within a few weeks, and the game frequently rotates its active codes.",
  "prison-life": "Prison Life codes are released periodically by the developers through their social media channels and official announcements. These codes typically reward in-game currency and exclusive cosmetic items that enhance your character's appearance. Redeem codes immediately upon discovery since they often expire within weeks, and always check the official Prison Life social media accounts for the latest releases.",
  "project-slayers": "Project Slayers codes are released periodically through the official Discord server and social media channels, typically rewarding in-game currency and cosmetic items. These codes expire after a set period, so it's crucial to redeem them promptly through the in-game menu. Join the community Discord and follow official announcements to catch codes before they become invalid.",
  "ragdoll-universe": "Ragdoll Universe codes are released periodically through the developer's social media channels and official Discord server. These codes typically reward in-game currency, cosmetics, and special items to enhance your ragdoll experience. Redeem codes promptly as they often expire after a few weeks, so check back regularly and join the community channels to catch new releases before they become invalid.",
  "rivals": "RIVALS codes are typically released during seasonal updates, battle pass launches, and special promotional events announced on the official social media channels. These codes usually reward in-game currency, cosmetic weapon skins, and exclusive character outfits that enhance your competitive loadout. Redeem codes immediately upon release as they often expire within 1-2 weeks, so monitor the community Discord and Twitter for the latest drops.",
  "ro-ghoul": "Ro-Ghoul codes are released periodically by developers on their social media channels and official announcements, typically rewarding in-game currency and cosmetic items. These codes have expiration dates that vary, so it's crucial to redeem them as soon as possible to avoid missing out on free rewards. Check the game's Discord server and Twitter regularly to catch new codes before they expire.",
  "shindo-life": "Shindo Life codes are released by the developers through their official social media accounts and community Discord, typically rewarding players with Spins and Yen to accelerate progression. These codes expire after a few weeks, so it's crucial to redeem them promptly before they become invalid. Focus on following the official Shindo Life social channels to catch new codes as soon as they're announced.",
  "slap-battles": "Slap Battles codes are released by developers during updates, events, and milestones, typically rewarding cosmetics and in-game currency. These codes expire after a few weeks, so redeem them promptly through the in-game code menu. Follow the official Slap Battles Discord and social media channels to catch new codes before they become invalid.",
  "sols-rng": "Sol's RNG codes are typically released through the game's Discord server and official social media accounts, rewarding players with spins, gems, and cosmetic items. These codes have expiration dates that vary, so it's crucial to redeem them as soon as you discover them to avoid missing out on free rewards that can accelerate your progression.",
  "southwest-florida": "Southwest Florida releases codes periodically through its Discord server and social media channels to reward active players. These codes typically grant in-game currency, cosmetic items, and exclusive vehicles that enhance your roleplay experience. Redeem codes promptly upon release since they often expire within weeks, and always check the official announcements to catch new releases before they become invalid.",
  "speed-run-4": "Speed Run 4 codes are released periodically through the game's official social media accounts and community Discord server, typically rewarding cosmetic items and in-game currency. These codes generally expire within 1-2 weeks of release, so it's crucial to redeem them promptly before they become invalid. The best strategy is to follow the game's announcements closely and redeem codes immediately upon discovery to secure exclusive rewards.",
  "squid-game": "Squid Game codes are released sporadically through the developer's social media and Discord server, typically rewarding in-game currency and cosmetic items. Since codes expire after a set period, monitor the official channels regularly and redeem them immediately upon discovery. Joining the community Discord is the best way to catch codes before they become invalid.",
  "starving-artists": "Starving Artists codes are released periodically by developers on their social media accounts and official Discord server. These codes typically reward in-game currency, cosmetic items, and starter bundles to help players build their artistic empire. Redeem codes as soon as possible since they often have expiration dates and limited redemption counts.",
  "strongman-simulator": "Strongman Simulator codes are typically released by the developer on their social media channels and official Discord server, rewarding players with currency boosts and cosmetic items to accelerate progression. These codes usually expire within a few weeks, so it's best to redeem them immediately upon discovery to avoid missing out on free rewards that can significantly speed up your strength training journey.",
  "super-golf": "Super Golf codes are typically released by the developers on their official social media channels and Discord server, primarily rewarding in-game currency and cosmetic items. These codes usually expire within 1-2 weeks, so it's best to redeem them immediately upon discovery. Follow the game's official announcements closely and join their community Discord to catch codes before they become invalid.",
  "super-striker-league": "Super Striker League codes are typically released during seasonal updates, special events, and milestone celebrations on the game's official social media channels. These codes usually reward in-game currency, cosmetic items, and player boosters that enhance your performance on the field. Redeem codes immediately upon discovery since they often have expiration dates ranging from a few weeks to a couple of months.",
  "survive-the-killer": "Survive the Killer codes are released periodically by the developers on their social media channels and Discord server, typically rewarding players with in-game currency and cosmetic items. These codes have expiration dates that vary, so it's crucial to redeem them as soon as possible to avoid missing out on free rewards. Join the official community channels and check back regularly to catch new codes before they expire.",
  "the-strongest-battlegrounds": "The Strongest Battlegrounds releases codes through official social media channels and community events, typically rewarding in-game currency and cosmetic items. These codes have expiration dates that vary, so it's essential to redeem them promptly when announced. Check the game's Discord server and Twitter regularly to catch new codes before they become invalid.",
  "toilet-tower-defense": "Toilet Tower Defense codes are typically released by developers on their social media channels and official Discord server to celebrate milestones, updates, and special events. These codes usually reward in-game currency, cosmetics, and exclusive units that can give you an advantage in battles. Redeem codes immediately upon discovery since they often expire within weeks, and always check the game's announcements to catch new releases before they become invalid.",
  "tower-defense-simulator": "Tower Defense Simulator codes are released by developers on their official social media channels and Discord server, typically rewarding in-game currency, cosmetics, and tower skins. These codes have expiration dates, so it's crucial to redeem them as soon as possible to avoid missing out. Follow the game's official announcements closely and join the community Discord to catch codes before they expire.",
  "type-soul": "Type Soul codes are typically released during major updates, seasonal events, and milestone celebrations on the official Discord and social media channels. These codes usually reward premium currency, cosmetic items, and battle pass progression to enhance your Soul Reaper experience. Redeem codes immediately upon discovery since they often have expiration dates tied to specific events, and always check the official Type Soul announcements to catch new releases before they expire.",
  "untitled-boxing-game": "Untitled Boxing Game codes are typically released by the developer through their Discord server and social media channels, often celebrating milestones or updates. These codes commonly reward in-game currency, cosmetic items, and boxing gloves to enhance your fighter's appearance and performance. Redeem codes immediately upon discovery since they usually have limited redemption windows and can expire within weeks.",
  "welcome-to-bloxburg": "Welcome to Bloxburg codes are released periodically by Coeptus on social media and official announcements, typically rewarding in-game currency and exclusive items. These codes often expire within weeks, so redeem them immediately upon discovery to secure your rewards before they become invalid. Follow the official Welcome to Bloxburg social accounts to catch new code releases and stay ahead of expiration dates.",
  "work-at-a-pizza-place": "Work at a Pizza Place codes are released periodically by the developer to celebrate milestones and updates, typically rewarding in-game currency and cosmetic items. These codes expire after a set period, so it's crucial to redeem them as soon as they're announced on the official social media channels. Join the game's community Discord and follow the developer's Twitter to catch codes before they become invalid.",
  "zombie-attack": "Zombie Attack codes are typically released by the developer through their social media channels and official Discord server following major updates or milestones. These codes generally reward players with in-game currency, weapon skins, and cosmetic items that enhance their zombie-slaying experience. Redeem codes promptly upon discovery since they often expire within weeks, and always check the game's announcement channels regularly to catch new releases before they become invalid.",
};

const gameRewards: Record<string, string[]> = {
  "blox-fruits": ["2x XP boosts for faster leveling", "Stat resets to respec your build", "In-game currency for items"],
  "adopt-me": ["Free Bucks to spend on eggs and pets", "Limited event items", "In-game cosmetics"],
  "murder-mystery-2": ["Free knives and cosmetic skins", "Seasonal limited items", "Event-exclusive accessories"],
  "grow-a-garden": ["Seeds and rare plants", "Fertilizer and growth boosters", "Gardening tools"],
  "brookhaven-rp": ["Free vehicles and props", "Exclusive roleplay items", "Seasonal cosmetics"],
  "tower-of-hell": ["Modifier tokens", "Rings for customization", "Event badges"],
  "royale-high": ["Free diamonds for the in-game shop", "Seasonal accessories", "Limited event items"],
  "doors": ["Free Knobs for the shop", "Cosmetic items", "Event-exclusive rewards"],
  "arsenal": ["Free weapon skins", "Bucks for cosmetics", "Seasonal event items"],
  "anime-fighting-simulator": ["Chikara Shards to power up", "Yen for upgrades", "Stat boosts"],
  "berry-avenue": ["Free in-game cash", "Roleplay items and props", "Seasonal cosmetics"],
  "livetopia": ["Coins for your virtual world", "Exclusive items", "Seasonal rewards"],
  "natural-disaster-survival": ["Badges and special items", "Event rewards", "Milestone cosmetics"],
  "anime-defenders": ["Free gems for summons", "Unit upgrade materials", "Event-exclusive rewards"],
  "funky-friday": ["Free points for songs and cosmetics", "Exclusive animations", "Collaboration rewards"],
  "kick-off": ["Free coins for customization", "Exclusive skins", "Tournament rewards"],
  "fisch": ["Free coins for progression", "Bait and fishing gear", "Rare item boosts"],
  "3008": [
    "In-game currency for purchases",
    "Cosmetic skins and character appearances",
    "Exclusive backpack and item skins"
  ],
  "99-nights-in-the-forest": [
    "In-game currency for purchases",
    "Exclusive cosmetic skins and items",
    "Survival gear and resource boosts"
  ],
  "all-star-tower-defense": [
    "Coins for purchasing towers and upgrades",
    "Gems for cosmetic skins and special items",
    "Exclusive limited-time unit unlock tokens"
  ],
  "anime-battlegrounds-x": [
    "In-game currency for summoning",
    "Exclusive rare anime characters",
    "Stat-boosting items and equipment"
  ],
  "anime-dimensions-simulator": [
    "In-game currency for purchases",
    "Experience and leveling boosts",
    "Cosmetic items and skins"
  ],
  "anime-impact-simulator": [
    "In-game currency for summoning",
    "Character skins and cosmetics",
    "Experience and stat multiplier boosts"
  ],
  "anime-story": [
    "In-game currency for purchases",
    "Experience and level boost items",
    "Cosmetic skins and character accessories"
  ],
  "anime-vanguards": [
    "In-game currency for summoning units",
    "Unit fragments and evolution materials",
    "Cosmetic skins and battle pass rewards"
  ],
  "arm-wrestle-simulator": [
    "In-game currency for upgrades",
    "Cosmetic items and avatar skins",
    "Experience or strength boosts"
  ],
  "attack-on-titan-revolution": [
    "Spins and Emperor Keys",
    "Experience and level boosters",
    "Exclusive cosmetics and skins"
  ],
  "barrys-prison-run": [
    "Cash for purchasing cosmetics",
    "Speed boost potions or buffs",
    "Exclusive character skins and cosmetics"
  ],
  "bedwars": [
    "Weapon skins and cosmetic item bundles",
    "Character skins and avatar customization",
    "Emotes and special in-game effects"
  ],
  "bee-swarm-simulator": [
    "Honey currency for bee care",
    "Bee eggs to expand colonies",
    "Royal jelly and boost items"
  ],
  "blade-ball": [
    "Coins for cosmetics",
    "Blade skins and weapon cosmetics",
    "Experience boosters and multipliers"
  ],
  "blue-lock-rivals": [
    "Gacha currency for player recruitment",
    "Exclusive player cards and skins",
    "Experience boosters and training materials"
  ],
  "break-in": [
    "In-game cash for purchasing items",
    "Exclusive cosmetics and character skins",
    "Special horror-themed event rewards"
  ],
  "build-a-boat-for-treasure": [
    "Cash currency for boat upgrades",
    "Cosmetic skins and boat designs",
    "Exclusive item drops and cosmetics"
  ],
  "camping": [
    "Cosmetic skins and character appearance items",
    "In-game currency for purchasing upgrades",
    "Exclusive camping gear and equipment"
  ],
  "car-dealership-tycoon": [
    "Cash currency for business expansion",
    "Gold premium currency for upgrades",
    "Exclusive vehicle cosmetics and skins"
  ],
  "clicker-simulator-x": [
    "Clicking power boosts and multiplier increases",
    "In-game currency for progression",
    "Exclusive cosmetic skins and pets"
  ],
  "creatures-of-sonaria": [
    "Creature skins and cosmetic appearance items",
    "In-game currency for purchases",
    "Exclusive accessories and decorative items"
  ],
  "da-hood": [
    "Cash and in-game currency",
    "Exclusive clothing and cosmetics",
    "Limited-time accessory items"
  ],
  "dandys-world": [
    "Cosmetic skins and character customization items",
    "In-game currency for purchases",
    "Exclusive badges and collectible items"
  ],
  "demon-slayer-rpg-2": [
    "In-game currency and Yen",
    "Experience and level progression boosters",
    "Cosmetic skins and weapon appearances"
  ],
  "deepwoken": [
    "Scales currency for purchasing items",
    "Cosmetic skins and character customization",
    "Battle pass progression and experience"
  ],
  "dragon-adventures": [
    "Gems and in-game currency",
    "Dragon eggs and hatching items",
    "Exclusive cosmetics and pet skins"
  ],
  "dress-to-impress": [
    "Exclusive clothing items and outfits",
    "Cosmetic accessories and fashion pieces",
    "In-game currency or premium rewards"
  ],
  "driving-empire": [
    "Cash currency for purchasing vehicles",
    "Cosmetic skins and car customization items",
    "Exclusive vehicle unlocks and upgrades"
  ],
  "evade": [
    "Cash currency for in-game purchases",
    "Exclusive cosmetic skins and accessories",
    "Boost tokens for XP progression"
  ],
  "fish-it": [
    "Cash for purchasing upgrades",
    "Cosmetic skins and rod appearances",
    "Experience multiplier boosts"
  ],
  "flee-the-facility": [
    "Cash currency for purchasing cosmetics",
    "Exclusive character skins and outfits",
    "Unique pet companions and accessories"
  ],
  "forsaken": [
    "Coins for cosmetics",
    "Exclusive cosmetic skins and accessories",
    "Special event items and power-ups"
  ],
  "fruit-battlegrounds": [
    "Beli currency for purchasing items",
    "Experience points to level up faster",
    "Exclusive cosmetics and fruit skins"
  ],
  "ghost-simulator": [
    "Ghost Coins for purchasing upgrades",
    "Experience boosters for faster leveling",
    "Exclusive cosmetic skins and effects"
  ],
  "grand-piece-online": [
    "Beli currency for purchasing items",
    "Experience boosters for faster leveling",
    "Cosmetic skins and unique appearances"
  ],
  "heroes-world": [
    "Gold and in-game currency",
    "Experience and level boosters",
    "Cosmetic items and accessories"
  ],
  "house-tycoon": [
    "Cash currency for purchasing properties",
    "Building materials and furniture items",
    "Cosmetic skins and house decorations"
  ],
  "hypershot": [
    "Credits for purchasing weapons and upgrades",
    "Exclusive weapon skins and cosmetics",
    "Character customization items and cosmetic accessories"
  ],
  "islands": [
    "In-game cash and currency",
    "Seeds and crops for farming",
    "Building materials and decorations"
  ],
  "jujutsu-infinite": [
    "Yen currency for character upgrades",
    "Skill Points for ability progression",
    "Cosmetic skins and item rewards"
  ],
  "jujutsu-shenanigans": [
    "Yen currency for progression",
    "Cosmetic skins and character outfits",
    "Experience boosters and battle passes"
  ],
  "kaiju-universe": [
    "Yen currency for upgrades",
    "Exclusive kaiju skins and cosmetics",
    "Starter items and power boosters"
  ],
  "king-legacy": [
    "Beli currency for purchasing items",
    "Experience points to level up faster",
    "Cosmetic items and exclusive accessories"
  ],
  "lumber-tycoon-2": [
    "Cash and Wood currency",
    "Cosmetic skins and axes",
    "Exclusive furniture and decorations"
  ],
  "meep-city": [
    "Coins for in-game purchases",
    "Exclusive pet cosmetics and skins",
    "Furniture and house decorations"
  ],
  "murder-party": [
    "Character skins and cosmetic outfits",
    "Weapon skins and item cosmetics",
    "In-game currency and bonus points"
  ],
  "muscle-legends": [
    "Cash currency for purchasing upgrades",
    "Experience boosters to speed up gains",
    "Exclusive cosmetic items and skins"
  ],
  "my-restaurant": [
    "Cash and in-game currency rewards",
    "Experience and progression multipliers",
    "Cosmetic items and restaurant decorations"
  ],
  "my-supermarket": [
    "In-game currency for purchases",
    "Cosmetic items and customizations",
    "Experience and progression boosters"
  ],
  "ninja-legends": [
    "Spins for summoning ninjas",
    "Gems for premium currency",
    "Experience and stat boosts"
  ],
  "obby-but-youre-on-a-bike": [
    "Exclusive bike skins and customization cosmetics",
    "In-game currency for purchases",
    "Wheelie tricks and bike effects"
  ],
  "pet-simulator-99": [
    "Gems for purchasing premium items",
    "Coins for upgrading and hatching eggs",
    "Exclusive or limited-edition pets"
  ],
  "pet-simulator-x": [
    "Exclusive pets and rare animal companions",
    "Gems for premium in-game purchases",
    "Coins to upgrade and expand collections"
  ],
  "piggy": [
    "Character skins and cosmetic outfits",
    "In-game currency for purchases",
    "Exclusive item bundles and cosmetics"
  ],
  "pls-donate": [
    "In-game cash currency",
    "Exclusive cosmetic hats and accessories",
    "Limited-time clothing and avatar items"
  ],
  "prison-life": [
    "Cash currency for in-game purchases",
    "Exclusive clothing and cosmetic items",
    "Special character skins and accessories"
  ],
  "project-slayers": [
    "Yen currency for progression",
    "Cosmetic items and skins",
    "Experience boosts and multipliers"
  ],
  "ragdoll-universe": [
    "Cash and currency for upgrades",
    "Exclusive cosmetics and ragdoll skins",
    "Boost items and special equipment"
  ],
  "rivals": [
    "Premium currency for cosmetics",
    "Exclusive weapon skins and wraps",
    "Character skins and outfit pieces"
  ],
  "ro-ghoul": [
    "Yen currency for purchasing items",
    "Cosmetic skins and character appearances",
    "Exclusive masks and weapon skins"
  ],
  "shindo-life": [
    "Spins for summoning new bloodlines",
    "Yen currency for upgrades",
    "Stat reset tokens for respec"
  ],
  "slap-battles": [
    "Glove skins and cosmetic items",
    "Cash currency for purchases",
    "Battle pass progress or XP"
  ],
  "sols-rng": [
    "Spins for gacha pulls",
    "Gems for cosmetics",
    "Seasonal exclusive items"
  ],
  "southwest-florida": [
    "In-game currency for purchases",
    "Exclusive vehicles and cosmetics",
    "Special roleplay job uniforms"
  ],
  "speed-run-4": [
    "Cosmetic trails and visual effects",
    "In-game currency for purchases",
    "Exclusive avatar accessories and skins"
  ],
  "squid-game": [
    "Cash currency for gameplay progression",
    "Cosmetic skins and character customizations",
    "Special event items and badges"
  ],
  "starving-artists": [
    "In-game currency for purchasing supplies",
    "Cosmetic items and avatar customization options",
    "Starter packs and resource bundles"
  ],
  "strongman-simulator": [
    "Cash and currency multipliers for faster grinding",
    "Cosmetic items and character appearance customization",
    "Experience boosters and strength training enhancements"
  ],
  "super-golf": [
    "Golf Coins for purchasing cosmetics",
    "Exclusive ball skins and clubs",
    "Cosmetic clothing and avatar items"
  ],
  "super-striker-league": [
    "Soccer coins for in-game purchases",
    "Cosmetic skins and player outfits",
    "Performance boosters and XP multipliers"
  ],
  "survive-the-killer": [
    "In-game currency for cosmetics",
    "Exclusive knife skins and cosmetics",
    "Survivor and killer character skins"
  ],
  "the-strongest-battlegrounds": [
    "Beli currency for purchases",
    "Cosmetic skins and accessories",
    "Experience and progression boosters"
  ],
  "toilet-tower-defense": [
    "Coins for purchasing towers and upgrades",
    "Gems for cosmetic skins and special items",
    "Exclusive units and tower variants"
  ],
  "tower-defense-simulator": [
    "In-game currency for upgrades",
    "Exclusive tower skins and cosmetics",
    "Double experience or cash boosters"
  ],
  "type-soul": [
    "RC and premium currency for cosmetics",
    "Battle pass points and seasonal progression",
    "Exclusive skins and character appearance items"
  ],
  "untitled-boxing-game": [
    "In-game currency for upgrades",
    "Exclusive boxing gloves and skins",
    "Stat boost tokens for fighters"
  ],
  "welcome-to-bloxburg": [
    "Cash currency for purchasing homes and furniture",
    "Exclusive clothing and cosmetic items",
    "Limited-time decorations and building materials"
  ],
  "work-at-a-pizza-place": [
    "Cash currency for faster progression",
    "Cosmetic items and character customization",
    "Special limited-time exclusive accessories"
  ],
  "zombie-attack": [
    "Coins for in-game purchases",
    "Exclusive weapon skins and cosmetics",
    "Experience boosters and survival bonuses"
  ],
};

const gameSlugMap: Record<string, string> = {
  "blox-fruits": "blox-fruits",
  "adopt-me": "adopt-me",
  "murder-mystery-2": "murder-mystery-2",
  "grow-a-garden": "grow-a-garden",
  "brookhaven-rp": "brookhaven-rp",
  "tower-of-hell": "tower-of-hell",
  "royale-high": "royale-high",
  "doors": "doors",
  "arsenal": "arsenal",
  "anime-fighting-simulator": "anime-fighting-simulator",
  "berry-avenue": "berry-avenue",
  "livetopia": "livetopia",
  "natural-disaster-survival": "natural-disaster-survival",
  "anime-defenders": "anime-defenders",
  "funky-friday": "funky-friday",
  "kick-off": "kick-off",
  "fisch": "fisch",
};

function formatNumber(n: number | null | undefined): string {
  if (!n) return "—";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

export default function CodesClient({ data, game, description, activeCodes, expiredCodes, statsData, activeCodeGames }: {
  data: any,
  game: string,
  description: string,
  activeCodes: any[],
  expiredCodes: any[],
  statsData: { currentPlayers: number | null; totalVisits: number | null } | null,
  activeCodeGames: { slug: string; game: string; icon: string }[],
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const tips = gameTips[game] || "";
  const rewards = gameRewards[game] || [];
  const quizSlug = gameSlugMap[game] || game;
  const newestCode = activeCodes[0] || null;

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      {/* Breadcrumb */}
      <nav style={{ marginBottom: 20 }}>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: 6, alignItems: "center", fontSize: 13, fontWeight: 700, color: "var(--text-dim)", flexWrap: "wrap" }}>
          <li><a href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</a></li>
          <li>›</li>
          <li><a href="/codes" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Roblox Codes</a></li>
          <li>›</li>
          <li style={{ color: "var(--text)" }}>{data.game + " Codes"}</li>
        </ol>
      </nav>

      {/* Hero */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{data.icon}</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 42px)", marginBottom: 12 }}>
          {data.game + " Codes 2026 — All Active & Working"}
        </h1>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 15, lineHeight: 1.7, marginBottom: 16, maxWidth: 600 }}>
          {description}
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
          <span style={{ background: "rgba(0,245,160,0.12)", color: "var(--neon-green)", fontWeight: 800, fontSize: 12, padding: "6px 16px", borderRadius: 100 }}>{"✅ " + activeCodes.length + " Active Codes"}</span>
          <span style={{ background: "rgba(255,60,172,0.1)", color: "var(--neon-pink)", fontWeight: 800, fontSize: 12, padding: "6px 16px", borderRadius: 100 }}>{"❌ " + expiredCodes.length + " Expired"}</span>
          <span style={{ background: "rgba(255,227,71,0.1)", color: "var(--neon-yellow)", fontWeight: 800, fontSize: 12, padding: "6px 16px", borderRadius: 100 }}>{"🔄 Updated " + data.updatedAt}</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>
          {"🕐 Last verified: " + data.updatedAt + " — we check for new codes regularly and update this page when new ones are found"}
        </div>
        <div style={{ marginTop: 12 }}>
          <FollowButton gameSlug={game} gameName={data.game} />
        </div>
      </div>

      {/* PLACEMENT 1 — Banner after hero, before codes */}
      <div style={{ marginBottom: 24 }}>
        <RobuxCTA variant="banner" game={data.game} />
      </div>

      {/* Latest code highlight */}
      {newestCode && (
        <div style={{ background: "linear-gradient(135deg, rgba(0,245,160,0.08), rgba(184,76,255,0.08))", border: "1px solid rgba(0,245,160,0.25)", borderRadius: "var(--radius)", padding: "20px 24px", marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: "var(--neon-green)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>{"🔥 Latest " + data.game + " Code"}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--neon-green)", letterSpacing: 2, marginBottom: 4 }}>{newestCode.code}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{"Reward: " + newestCode.reward}</div>
            </div>
            <button onClick={() => copyCode(newestCode.code)}
              style={{ background: copied === newestCode.code ? "rgba(0,245,160,0.2)" : "var(--gradient-main)", color: copied === newestCode.code ? "var(--neon-green)" : "var(--bg)", border: copied === newestCode.code ? "1px solid var(--neon-green)" : "none", borderRadius: 100, padding: "10px 24px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: copied === newestCode.code ? "var(--neon-green)" : "var(--bg)" }}>
              {copied === newestCode.code ? "✅ Copied!" : "📋 Copy Code"}
            </button>
          </div>
        </div>
      )}

      {/* How to redeem */}
      <div style={{ background: "rgba(0,245,160,0.05)", border: "1px solid rgba(0,245,160,0.2)", borderRadius: "var(--radius)", padding: "22px 24px", marginBottom: 32 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--neon-green)", marginBottom: 12 }}>
          {"How To Redeem " + data.game + " Codes"}
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, margin: 0 }}>
          {data.howToRedeem}
        </p>
        <p style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, marginTop: 12, fontStyle: "italic" }}>
          ⚠️ Codes are case sensitive — type them exactly as shown above.
        </p>
      </div>

      {/* Active codes */}
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16 }}>
        {"🟢 " + data.game + " Codes 2026 — Active & Working"}
      </h2>

      {activeCodes.length === 0 ? (
        <div style={{ marginBottom: 24 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "18px 24px", marginBottom: 16, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>🔍</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>
                {"No active codes right now for " + data.game}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.6 }}>
                {"We monitor this page continuously. When new codes drop, this list updates immediately — usually within hours of the developer announcement."}
              </div>
            </div>
          </div>

          <div style={{ background: "linear-gradient(135deg, rgba(0,245,160,0.08), rgba(184,76,255,0.08))", border: "1px solid rgba(0,245,160,0.3)", borderRadius: "var(--radius)", padding: "24px 28px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "var(--neon-green)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              {"🔔 Get Alerted When " + data.game + " Codes Drop"}
            </div>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.6, marginBottom: 16 }}>
              {"Follow " + data.game + " and we'll email you the moment new codes are released — before they expire."}
            </p>
            <FollowButton gameSlug={game} gameName={data.game} />
          </div>

          {rewards.length > 0 && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "20px 24px", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, marginBottom: 12, color: "var(--text)" }}>
                {"What " + data.game + " Codes Usually Give"}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {rewards.map((reward, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>
                    <span style={{ color: "var(--neon-green)", fontWeight: 900, flexShrink: 0 }}>✓</span>
                    {reward}
                  </div>
                ))}
              </div>
              {tips && (
                <p style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, lineHeight: 1.6, marginTop: 14, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                  {tips}
                </p>
              )}
            </div>
          )}

          <div style={{ background: "rgba(255,227,71,0.06)", border: "1px solid rgba(255,227,71,0.15)", borderRadius: "var(--radius-sm)", padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "var(--neon-yellow)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>⏳ While You Wait</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {["Codes expire fast — redeem within hours of release", "Codes are case sensitive — copy exactly as shown", "Follow the game's official Twitter/X and Discord for announcements"].map((tip, i) => (
                <div key={i} style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, display: "flex", gap: 8 }}>
                  <span style={{ flexShrink: 0 }}>•</span>{tip}
                </div>
              ))}
            </div>
          </div>

          {activeCodeGames.length > 0 && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "20px 24px" }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>🎁 Games With Active Codes Right Now</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {activeCodeGames.map((g) => (
                  <a key={g.slug} href={`/codes/${g.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 100, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textDecoration: "none", whiteSpace: "nowrap" }}>
                    <span>{g.icon}</span>{g.game}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {activeCodes.map((c: any) => (
            <div key={c.code} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {c.isNew && <span style={{ fontSize: 10, fontWeight: 900, background: "var(--neon-green)", color: "var(--bg)", padding: "2px 8px", borderRadius: 100 }}>NEW</span>}
                <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--neon-green)", letterSpacing: 1 }}>{c.code}</span>
                <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{"→ " + c.reward}</span>
              </div>
              <button onClick={() => copyCode(c.code)}
                style={{ background: copied === c.code ? "rgba(0,245,160,0.2)" : "var(--gradient-main)", color: copied === c.code ? "var(--neon-green)" : "var(--bg)", border: copied === c.code ? "1px solid var(--neon-green)" : "none", borderRadius: 100, padding: "8px 20px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: copied === c.code ? "var(--neon-green)" : "var(--bg)", minWidth: 90, transition: "all 0.2s" }}>
                {copied === c.code ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* PLACEMENT 2 — Card after codes list */}
      <div style={{ marginBottom: 24 }}>
        <RobuxCTA variant="card" game={data.game} />
      </div>

      {/* Quiz CTA */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px 24px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>{data.icon}</span>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 15, marginBottom: 3 }}>{"Think You Know " + data.game + "?"}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{"Test your knowledge with free " + data.game + " trivia quizzes!"}</div>
          </div>
        </div>
        <a href={"/games/" + quizSlug} style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 13, padding: "10px 22px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)", whiteSpace: "nowrap", flexShrink: 0 }}>
          {"🎮 Take the Quiz"}
        </a>
      </div>

      {/* Stats cross-link */}
      {statsData && (statsData.currentPlayers || statsData.totalVisits) && (
        <a href={`/stats/${game}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "linear-gradient(135deg, #0d1f3c 0%, #0f2744 100%)", border: "1px solid rgba(0,180,216,0.25)", borderRadius: "var(--radius)", padding: "16px 24px", textDecoration: "none", marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {statsData.currentPlayers && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,180,216,0.8)", marginBottom: 2 }}>Playing Now</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#00b4d8", fontVariantNumeric: "tabular-nums" }}>{formatNumber(statsData.currentPlayers)}</div>
              </div>
            )}
            {statsData.totalVisits && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>Total Visits</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.7)", fontVariantNumeric: "tabular-nums" }}>{formatNumber(statsData.totalVisits)}</div>
              </div>
            )}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#00b4d8", whiteSpace: "nowrap" }}>📊 View Live Stats →</div>
        </a>
      )}

      {/* Expiring notice */}
      <div style={{ background: "rgba(255,227,71,0.08)", border: "1px solid rgba(255,227,71,0.2)", borderRadius: "var(--radius-sm)", padding: "14px 20px", marginBottom: 40, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 20 }}>⚠️</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--neon-yellow)", marginBottom: 2 }}>Codes Expire Without Warning</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>Codes can expire at any time without notice. This page is checked regularly — bookmark it and revisit when you want the latest verified codes.</div>
        </div>
      </div>

      {/* Tips */}
      {tips && activeCodes.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 12 }}>{"Tips for Using " + data.game + " Codes"}</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>{tips}</p>
        </div>
      )}

      {/* Expired codes */}
      {expiredCodes.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8, color: "var(--text-muted)" }}>{"🔴 Expired " + data.game + " Codes"}</h2>
          <p style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 12 }}>These codes no longer work but are kept for reference.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {expiredCodes.map((c: any) => (
              <div key={c.code} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 15, textDecoration: "line-through", color: "var(--text-dim)" }}>{c.code}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{c.reward}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: "var(--neon-pink)" }}>Expired</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16 }}>{"Frequently Asked Questions"}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { q: `How many active ${data.game} codes are there in 2026?`, a: `There are currently ${activeCodes.length} active ${data.game} codes listed on this page. We update regularly as new codes are released by the developers.` },
            { q: `Why isn't my ${data.game} code working?`, a: `Codes are case sensitive — type them exactly as shown. The code may also have expired or already been redeemed on your account. Check the active/expired status above.` },
            { q: `How often are new ${data.game} codes released?`, a: `New ${data.game} codes are typically released during major updates, milestones, and seasonal events. Follow the game's official Twitter/X and Discord for the fastest announcements. This page is checked regularly and updated when new codes are confirmed.` },
            { q: `Can I reuse a ${data.game} code?`, a: `No — each code can only be redeemed once per account. Attempting to use a code you've already redeemed will show an error message.` },
          ].map((faq, i) => (
            <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "16px 20px" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>{faq.q}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7 }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PLACEMENT 3 — Default above bottom CTA */}
      <div style={{ marginBottom: 24 }}>
        <RobuxCTA variant="default" game={data.game} />
      </div>

      {/* Bottom CTA */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "28px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{data.icon}</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 8 }}>{"More " + data.game + " Content"}</h2>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" }}>
          {"Explore all " + data.game + " quizzes, live player stats, or browse codes for every Roblox game."}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href={"/games/" + quizSlug} style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
            {"🎮 " + data.game + " Quizzes"}
          </a>
          <a href={"/stats/" + game} style={{ background: "linear-gradient(135deg, #00b4d8, #0077b6)", color: "#fff", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none" }}>
            {"📊 Live Stats"}
          </a>
          <a href="/codes" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none" }}>
            {"🎁 All Roblox Codes"}
          </a>
        </div>
      </div>

    </div>
  );
}