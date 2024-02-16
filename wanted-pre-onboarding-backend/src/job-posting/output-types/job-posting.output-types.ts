import { Prisma } from '@prisma/client';

// https://www.prisma.io/blog/satisfies-operator-ur8ys8ccq7zb#infer-the-output-type-of-methods-like-findmany-and-create
export const includeCompanyAndSelectJobPostingsId = {
  company: {
    include: {
      jobPostings: {
        select: {
          id: true,
        },
      },
    },
  },
} satisfies Prisma.JobPostingInclude;

export type JobPostingWithCompanyAndJobPostingsId =
  Prisma.JobPostingGetPayload<{
    include: typeof includeCompanyAndSelectJobPostingsId;
  }>;

export const includeCompany = {
  company: true,
} satisfies Prisma.JobPostingInclude;

export type JobPostingWithCompany = Prisma.JobPostingGetPayload<{
  include: typeof includeCompany;
}>;
