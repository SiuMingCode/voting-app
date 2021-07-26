const { pool } = require('../db')

async function createCampaign (campaign) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const res = await client.query(`
    INSERT INTO campaign(
      title,
      start_time,
      end_time
    )
    VALUES ($1, $2, $3)
    RETURNING campaign_id AS "campaignId"
    `, [campaign.title, campaign.start, campaign.end])

    campaign.campaignId = res.rows[0].campaignId

    for (const candidate of campaign.candidates) {
      await client.query(`
      INSERT INTO campaign_candidate(
        campaign_id,
        title
      )
      VALUES ($1, $2)
      `, [campaign.campaignId, candidate.title])
    }

    await client.query('COMMIT')

    return campaign
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

async function getCampaignCandidateVotes (campaignId, candidateTitle) {
  const res = await pool.query(`
  SELECT
    COUNT(*) AS "count"
  FROM vote
  WHERE campaign_id = $1
    AND campaign_candidate_title = $2
  `, [campaignId, candidateTitle])

  return res.rows[0].count
}

async function getCampaignCandidates (campaignId) {
  const res = await pool.query(`
  SELECT
    title
  FROM campaign_candidate
  WHERE campaign_id = $1
  `, [campaignId])

  return res.rows
}

async function getCampaign (campaignId) {
  const res = await pool.query(`
  SELECT
    campaign_id AS "campaignId",
    title,
    start_time AS "start",
    end_time AS "end"
  FROM campaign
  WHERE campaign_id = $1
  `, [campaignId])

  if (res.rows.length > 0) {
    const campaign = res.rows[0]
    campaign.candidates = await getCampaignCandidates(campaignId)
    for (const candidate of campaign.candidates) {
      if (campaign.start < new Date()) {
        candidate.votes = await getCampaignCandidateVotes(campaign.campaignId, candidate.title)
      } else {
        candidate.votes = 0
      }
    }

    return campaign
  } else {
    return null
  }
}

async function getCampaigns (cursor) {
  const res = await pool.query(`
  SELECT
    campaign_id AS "campaignId",
    title,
    start_time AS "start",
    end_time AS "end"
  FROM campaign
  WHERE end_time <= $1
    AND campaign_id < $2
  ORDER BY end_time DESC, campaign_id DESC
  LIMIT 10
  `, [cursor.end, cursor.campaignId])

  const campaigns = res.rows
  for (const campaign of campaigns) {
    campaign.candidates = await getCampaignCandidates(campaign.campaignId)
    for (const candidate of campaign.candidates) {
      if (campaign.start < new Date()) {
        candidate.votes = await getCampaignCandidateVotes(campaign.campaignId, candidate.title)
      } else {
        candidate.votes = 0
      }
    }
  }

  return campaigns
}

async function deleteCampaign (campaignId) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    await client.query(`
    DELETE FROM vote
    WHERE campaign_id = $1
    `, [campaignId])

    await client.query(`
    DELETE FROM campaign_candidate
    WHERE campaign_id = $1
    `, [campaignId])

    await client.query(`
    DELETE FROM campaign
    WHERE campaign_id = $1
    `, [campaignId])

    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

async function voteCampaign (ballot) {
  await pool.query(`
  INSERT INTO vote(
    campaign_id,
    campaign_candidate_title,
    hkid
  )
  VALUES ($1, $2, $3)
  `, [ballot.campaignId, ballot.candidateTitle, ballot.hkid])
}

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaign,
  deleteCampaign,
  voteCampaign
}
