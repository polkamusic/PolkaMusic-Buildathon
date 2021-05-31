CREATE TABLE polkamusic.user (
song_name varchar(255) NOT NULL,
artist_name varchar(255) NOT NULL,
song_track varchar(255) NOT NULL,
song_album varchar(255) NOT NULL,            
song_url varchar(255) NOT NULL,
song_src varchar(100) NOT NULL,
album_art varchar(200) NOT NULL,
);

favorites_playlist
{
user_publickey
playlist_id
}

CREATE TABLE favourites_playlist(
    user_publickey varchar(100) NOT NULL,
    playlist_id INT
);



playlist can be empty 
PlayList Table
playlist_id,user_publickey,playlist_name

CREATE TABLE playlist(
    playlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_publickey varchar(100) NOT NULL,
    playlist_name varchar(200) NOT NULL
);


THis is the TAble for songs src of a
playlist_id,song_src

FAVOURITES TABLE

CREATE TABLE favourites(
    song_src varchar(100) NOT NULL,
    playlist_id INT
);

favorites_songs
{
user_publickey
song_src
}

CREATE TABLE favourite_songs(
    user_publickey varchar(100) NOT NULL,
    song_src varchar(100) NOT NULL
);

Reports Table
Attributes of Reports Table
song_src,duration,user_publickey,processed type bool

CREATE TABLE reports(
    song_src varchar(100) NOT NULL,
    duration INT,
    user_publickey varchar(100) NOT NULL,
    processed BOOLEAN DEFAULT FALSE
);

src = smart record contract


User id is require
User has many albums
albums has many songs
ipfs hash



INSERT INTO polkamusic.user (song_name, artist_name, song_track, song_album, song_url)
VALUES('Peaches','Justin Bieber,Daniel Caesar, Giveon','Justin Bieber','Justin Bieber','https://youtu.be/tQ0yjYUFKAE');


DELETE FROM polkamusic.user;

SELECT song_name, artist_name, song_track, song_album, song_url
FROM polkamusic.user;


nft: (T::ClassId, T::TokenId),
start_price: BalanceOf<T>,
start: T::BlockNumber,
end: T::BlockNumber,