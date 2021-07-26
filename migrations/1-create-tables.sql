CREATE TABLE campaign (
	campaign_id SERIAL,
	title TEXT NOT NULL,
	start_time TIMESTAMP WITH TIME ZONE NOT NULL,
	end_time TIMESTAMP WITH TIME ZONE NOT NULL,
	PRIMARY KEY (campaign_id)
);

CREATE TABLE campaign_candidate (
	campaign_id INTEGER REFERENCES campaign (campaign_id),
	title TEXT,
	PRIMARY KEY (campaign_id, title)
);

CREATE TABLE vote (
	campaign_id INTEGER,
	campaign_candidate_title TEXT,
    hkid VARCHAR(11),
	PRIMARY KEY (campaign_id, campaign_candidate_title, hkid),
    FOREIGN KEY (campaign_id, campaign_candidate_title) REFERENCES campaign_candidate (campaign_id, title),
	UNIQUE (campaign_id, hkid)
);
