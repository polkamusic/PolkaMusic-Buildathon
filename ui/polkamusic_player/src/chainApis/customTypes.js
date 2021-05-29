export const polmTypes = {
    "SongName": "Vec<u8>",
    "ArtistName": "Vec<u8>",
    "Composer": "Vec<u8>",
    "Lyricist": "Vec<u8>",
    "YOR": "Vec<u8>",
    "TestData": {
      "name": "SongName",
      "artist": "ArtistName",
      "composer": "Composer",
      "lyricist": "Lyricist",
      "year": "YOR"
    },
    "SrcId": "Vec<u8>",
    "SongId": "Vec<u8>",
    "MusicData": {
      "src_id": "SrcId",
      "owner": "AccountId",
      "song_id": "SongId",
      "props": "Option<Vec<TestData>>",
      "registered": "Moment"
    }
  }

export const polmNftTypes = 
  {
    "Address": "AccountId",
    "LookupSource": "AccountId",
    "ClassData": "u32",
    "ClassId": "u64",
    "TokenId": "u64",
    "TokenData": "u32",
    "ClassInfo": {
      "metadata": "Vec<u8>",
      "total_issuance": "TokenId",
      "owner": "AccountId",
      "data": "TokenData"
    },
    "ClassInfoOf": "ClassInfo",
    "TokenInfo": {
      "metadata": "Vec<u8>",
      "owner": "AccountId",
      "data": "TokenData"
    },
    "TokenInfoOf": "TokenInfo"
  }
 

  