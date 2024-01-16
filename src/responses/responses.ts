export const responses = {
  ok: {
    code: 200,
    message: `Ok`,
  },
  noService: {
    code: 400,
    message: `The service must be defined`,
  },
  noSection: {
    code: 400,
    message: `The section must be defined`,
  },
  accessDenied: {
    code: 403,
    message: `Access denied`,
  },
  funcNotFound: {
    code: 404,
    message: `Function not found`,
  },
  funcNotImplemented: {
    code: 501,
    message: `Function not implemented`,
  }
}