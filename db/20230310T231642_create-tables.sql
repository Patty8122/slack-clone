create table users (
  id INTEGER PRIMARY KEY,
  name VARCHAR(40) UNIQUE,
  password VARCHAR(40),
  api_key VARCHAR(40)
);

create table channels (
    uuid varchar(500) PRIMARY KEY,
    name VARCHAR(40) UNIQUE
);

-- there are messages within a channel
create table messages (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  channel_id VARCHAR(500),
  body TEXT,
  reply_to INT,
  posted DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(channel_id) REFERENCES channels(channel_id) ON DELETE CASCADE ON UPDATE CASCADE
  FOREIGN KEY(reply_to) REFERENCES messages(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- there are emojis for each message
create table emojis (
  id INTEGER PRIMARY KEY,
  message_id INTEGER,
  emoji VARCHAR(40),
  FOREIGN KEY(message_id) REFERENCES messages(id) ON DELETE CASCADE ON UPDATE CASCADE
);



-- unread messages for each user
create table unread (
  user_id INTEGER,
  channel_id VARCHAR(500),
  message_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(channel_id) REFERENCES channels(channel_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(message_id) REFERENCES messages(id) ON DELETE CASCADE ON UPDATE CASCADE
);