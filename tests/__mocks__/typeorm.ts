export const getRepository = jest.fn().mockReturnValue({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});
