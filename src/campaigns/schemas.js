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

module.exports = {
  campaignSchema,
  createCampaignSchema
}
