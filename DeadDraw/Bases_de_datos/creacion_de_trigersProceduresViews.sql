USE DeadDraw;
/* this view is used to get the Cards that are in the maze, it is used to get the Cards that are in the maze and their values, it is used to get the Cards that are in the maze and their values and their Deck id
*/
CREATE view Card_in_maze AS
SELECT idCard, value,idDeck from Card INNER JOIN CardInDeck USING(idCard);

/* this view is used to get the efects of each Card
*/
CREATE view Card_effects AS
SELECT idCard,suit,name  FROM Card INNER JOIN CardEffect USING(idCard) INNER JOIN Effect USING(idEffect) ORDER BY idCard;

/*this view is used to get the number of Cards in each Deck
*/
CREATE view Deck_Cards AS
SELECT name, COUNT(idCard) from Deck INNER JOIN CardInDeck USING(idDeck) INNER JOIN Card USING(idCard) group by idDeck;


/*this view is used to get the Cards that the player has with effect and in wich maze the player has them
*/
USE DeadDraw;
CREATE VIEW player_Decks_info AS
SELECT username, e.name, suit,d.name as DeckName
FROM Player
INNER JOIN MatchGame USING (idPlayer)
INNER JOIN Deck d USING (idDeck)
INNER JOIN CardInDeck USING (idDeck)
INNER JOIN Card USING (idCard)
INNER JOIN CardEffect USING (idCard)
INNER JOIN Effect e USING (idEffect)
WHERE e.name != 'noeffect'
ORDER BY idDeck DESC;


/*this view is used to get the score of each player
*/
create view player_score AS
SELECT username, score FROM Player INNER JOIN MatchGame USING(idPlayer) ORDER BY score DESC;

/*this view is used to get the lootboxes that the player has opened and their cost and quality and opening date
*/
CREATE View player_lootboxes AS
SELECT username, idLootbox, cost,quality,openingDate 
FROM Player 
INNER JOIN PlayerLootbox USING(idPlayer) 
INNER JOIN Lootbox USING (idLootbox) 
ORDER BY openingDate DESC;

/*this view is used to get the number of times each Deck has been used by each player
*/
CREATE VIEW player_DeckTimesUsed AS
SELECT username, name, COUNT(idDeck) AS times_used
FROM Player
INNER JOIN MatchGame USING (idPlayer)
INNER JOIN Deck USING (idDeck)
GROUP BY username, name;


/* View to get the active time for each player in seconds */
CREATE view player_active_time AS
SELECT username, TIMESTAMPDIFF(SECOND, startDate, endDate) as active_time 
FROM Player 
INNER JOIN MatchGame USING(idPlayer) 
WHERE endDate IS NOT NULL 
ORDER BY active_time DESC;

/*this view is used to get the number of times each player has wined a match
*/

CREATE VIEW player_timesWined AS
SELECT username,sum(result = 'victory') as times_wined 
FROM Player 
INNER JOIN MatchGame USING(idPlayer) 
GROUP BY username 
ORDER BY times_wined DESC;   


/*this view is used to get the number of Cards of each type that are in each Deck
*/
CREATE VIEW deck_Card_types AS
select name,suit, count(*) as count 
from Deck 
INNER JOIN CardInDeck USING(idDeck) 
INNER JOIN Card USING(idCard) 
group by name, suit;



/* -------------------------------- triggers -------------------------------- */

/*this trigger is used to update the score of the player after a match*/
drop trigger if exists update_score_after_match;
DELIMITER $$

CREATE TRIGGER update_score_after_match
BEFORE UPDATE ON MatchGame
FOR EACH ROW
BEGIN
    IF NEW.result = 'victory' THEN
        SET NEW.score = NEW.score + 1;
    END IF;
END$$

DELIMITER ;

DROP TRIGGER IF EXISTS INSERT_player_passwordTooShort;

/*this trigger is used to not allow the player to have a password that is less than 8 characters long
*/
DELIMITER $$

CREATE Trigger INSERT_player_passwordTooShort
BEFORE INSERT ON Player
FOR EACH ROW
BEGIN
    IF LENGTH(NEW.password) < 8 THEN
       signal SQLSTATE '45000' SET MESSAGE_TEXT = 'Password must be at least 8 characters long';
    END IF;
END$$

DELIMITER ;


/*this trigger is used to update the lastUpdate field of the player table every time the player updates his information
*/

DROP TRIGGER IF EXISTS update_lastUpdate;

DELIMITER $$

CREATE Trigger update_lastUpdate
BEFORE UPDATE ON Player
FOR EACH ROW
BEGIN
    SET NEW.lastUpdate = NOW();
END$$

DELIMITER ;

DROP TRIGGER IF EXISTS update_username_duplicate;

/*this trigger is used to not allow the player to have a username that already exists in the database
*/
DELIMITER $$

CREATE Trigger update_username_duplicate
BEFORE INSERT ON Player
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT * FROM Player WHERE username = NEW.username AND idPlayer != NEW.idPlayer) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Username already exists';
    END IF;
END$$

DELIMITER ;


/* ------------------------------------ procedure---------------------------------- */


DROP PROCEDURE IF EXISTS player_CardsPowerups;

/*this procedure is used to get the Cards that the player has with effect and in wich maze the player has them
*/
DELIMITER $$

CREATE Procedure player_CardsPowerups(IN p_idPlayer INT)
BEGIN
    SELECT username, d.name, suit, e.name as effect_name
    FROM Player
    INNER JOIN MatchGame USING (idPlayer)
    INNER JOIN Deck d USING (idDeck)
    INNER JOIN CardInDeck USING (idDeck)
    INNER JOIN Card USING (idCard)
    INNER JOIN CardEffect USING (idCard)
    INNER JOIN Effect e USING (idEffect)
    WHERE Player.idPlayer = p_idPlayer AND e.name != 'noeffect'
    ORDER BY idDeck DESC;
END$$

DELIMITER ;



/*this procedure is used to get the lootboxes that the player has opened and their cost and quality and opening date
*/
DELIMITER $$

CREATE Procedure player_lootboxes_info(IN p_idPlayer INT)
BEGIN
    SELECT username, idLootbox, cost,quality,openingDate 
    FROM Player 
    INNER JOIN PlayerLootbox USING(idPlayer) 
    INNER JOIN Lootbox USING (idLootbox) 
    WHERE Player.idPlayer = p_idPlayer 
    ORDER BY openingDate DESC;
END$$

DELIMITER ;

DROP PROCEDURE IF EXISTS all_players_scores;

/*this procedure is used to get the avg score of all the players and the total number of players in the database
*/
DELIMITER $$

CREATE Procedure all_players_scores(out total_players INT, out average_score FLOAT)
BEGIN
    SELECT COUNT(*) INTO total_players FROM Player;
    SELECT ROUND(AVG(score)) INTO average_score FROM MatchGame;
END$$

DELIMITER ;

DROP PROCEDURE IF EXISTS Deck_usage_statistics;

/*this procedure is used to get the number of Decks in the database and the average usage of each Deck in the matches
*/
DELIMITER $$

CREATE Procedure Deck_usage_statistics(out total_Decks INT, out average_usage FLOAT)
BEGIN
    SELECT COUNT(*) INTO total_Decks FROM Deck;
    SELECT round(AVG(idDeck)) INTO average_usage FROM MatchGame;
END$$

delimiter ;