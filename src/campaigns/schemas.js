const campaignSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    title: {
      type: 'string'
    },
    start: {
      type: 'string',
      format: 'date-time'
    },
    end: {
      type: 'string',
      format: 'date-time'
    },
    candidates: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          title: {
            type: 'string'
          }
        },
        required: [
          'id',
          'title'
        ],
        additionalProperties: false
      },
      minItems: 1
    }
  },
  required: [
    'id',
    'title',
    'start',
    'end',
    'candidates'
  ],
  additionalProperties: false
}

const createCampaignSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string'
    },
    start: {
      type: 'string',
      format: 'date-time'
    },
    end: {
      type: 'string',
      format: 'date-time'
    },
    candidates: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: {
            type: 'string'
          }
        },
        required: [
          'title'
        ],
        additionalProperties: false
      },
      minItems: 1
    }
  },
  required: [
    'title',
    'start',
    'end',
    'candidates'
  ],
  additionalProperties: false
}

const hkidSchema = {
  type: 'string',
  pattern: '^[A-Z]{1,2}[0-9]{6}\\([0-9A]\\)$'
}

const voteSchema = {
  type: 'object',
  properties: {
    candidateTitle: {
      type: 'string'
    },
    hkid: hkidSchema
  },
  required: [
    'candidateTitle',
    'hkid'
  ],
  additionalProperties: false
}

module.exports = {
  campaignSchema,
  createCampaignSchema,
  voteSchema
}
