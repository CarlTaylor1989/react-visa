import * as achievements from '../../lib/achievements';
import { groups } from '../../config/achievements';

beforeEach(() => {
  jest.resetAllMocks();
});

test('method lib.sortedAchievements()', () => {
  const output = achievements.lib.sortedAchievements();
  const last = 'ac17';
  expect(output[0].id).toEqual(last);
});

describe('method lib.getPercentageComplete()', () => {
  test('returns the not completed percentage', () => {
    const percentage = achievements.lib.getPercentageComplete(0, 10);
    expect(percentage).toEqual(0);
  });

  test('returns the percentage', () => {
    // setup
    const completed = 499;
    const total = 1000;
    const expected = 50;

    // function under test
    const percentage = achievements.lib.getPercentageComplete(completed, total);

    // expectations
    expect(percentage).toEqual(expected);
  });
});

describe('method getUserAchievementData()', () => {
  const achievementId = 'irrelevant';
  let achievement;
  let completed;
  beforeEach(() => {
    achievements.lib.sortedAchievements = jest.fn();
  });

  describe('scored case', () => {
    beforeEach(() => {
      achievement = {
        id: achievementId,
        group: groups.scored,
        max: 5000
      };
      achievements.lib.sortedAchievements.mockReturnValue([achievement]);
    });

    test('completed achievement', () => {
      // setup
      achievements.lib.getPercentageComplete = jest.fn().mockReturnValue(100);
      completed = ['irrelevant'];
      const total = 10000;

      // function under test
      const output = achievements.getUserAchievementData({ completed, total });

      // expectation
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: true,
          completedAmount: achievement.max,
          completedPercent: 100,
          totalAmount: achievement.max
        })
      })]));
    });

    test('incomplete achievement', () => {
      // setup
      achievements.lib.getPercentageComplete = jest.fn().mockReturnValue(50);
      completed = [];
      const total = 2500;

      // function under test
      const output = achievements.getUserAchievementData({ completed, total });

      // expectation
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: false,
          completedAmount: total,
          completedPercent: 50,
          totalAmount: achievement.max
        })
      })]));
    });
  });

  describe('challenges case', () => {
    beforeEach(() => {
      achievement = {
        id: achievementId,
        group: groups.challenges,
        max: 1
      };
      achievements.lib.sortedAchievements.mockReturnValue([achievement]);
    });

    test('completed achievement with max value', () => {
      // setup
      achievements.lib.getPercentageComplete = jest.fn().mockReturnValue(100);
      const noOfCompletedChallenges = 1;
      completed = ['irrelevant'];

      // function under test
      const output = achievements.getUserAchievementData({ noOfCompletedChallenges, completed });

      // expectation
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: true,
          completedAmount: achievement.max,
          completedPercent: 100,
          totalAmount: achievement.max
        })
      })]));
    });

    test('completed perfect achievement with max value', () => {
      // setup
      achievement.perfect = true;
      achievements.lib.getPercentageComplete = jest.fn().mockReturnValue(100);
      const noOfPerfectChallenges = 1;
      completed = ['irrelevant'];

      // function under test
      const output = achievements.getUserAchievementData({ noOfPerfectChallenges, completed });

      // expectation
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: true,
          completedAmount: achievement.max,
          completedPercent: 100,
          totalAmount: achievement.max
        })
      })]));
    });

    test('incomplete achievement with max value', () => {
      // setup
      achievements.lib.getPercentageComplete = jest.fn().mockReturnValue(0);
      const noOfCompletedChallenges = 1;
      completed = [];

      // function under test
      const output = achievements.getUserAchievementData({ noOfCompletedChallenges, completed });

      // expectation
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: false,
          completedAmount: noOfCompletedChallenges,
          completedPercent: 0,
          totalAmount: achievement.max
        })
      })]));
    });

    test('completed achievement with progress value', () => {
      // setup
      delete achievement.max;
      achievement.progress = 2;
      achievements.lib.getPercentageComplete = jest.fn().mockReturnValue(100);
      completed = ['irrelevant'];

      // function under test
      const output = achievements.getUserAchievementData({ completed });

      // expectation
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: true,
          completedAmount: 1,
          completedPercent: 100,
          totalAmount: 1
        })
      })]));
    });

    test('incomplete achievement without max and progress values', () => {
      // setup
      delete achievement.max;
      achievements.lib.getPercentageComplete = jest.fn().mockReturnValue(0);
      completed = [];

      // function under test
      const output = achievements.getUserAchievementData({ completed });

      // expectation
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: false,
          completedAmount: 0,
          completedPercent: 0,
          totalAmount: 1
        })
      })]));
    });
  });

  describe('products case', () => {
    beforeEach(() => {
      achievement = {
        id: achievementId,
        group: groups.products,
        max: 10
      };
      achievements.lib.sortedAchievements.mockReturnValue([achievement]);
    });

    test('completed achievement', () => {
      // setup
      achievements.lib.getPercentageComplete = jest.fn().mockReturnValue(100);
      const noOfCompletedProducts = 10;
      completed = ['irrelevant'];

      // function under test
      const output = achievements.getUserAchievementData({ noOfCompletedProducts, completed });

      // expectation
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: true,
          completedAmount: achievement.max,
          completedPercent: 100,
          totalAmount: achievement.max
        })
      })]));
    });

    test('incomplete achievement', () => {
      // setup
      achievements.lib.getPercentageComplete = jest.fn().mockReturnValue(50);
      const noOfCompletedProducts = 5;
      completed = [];

      // function under test
      const output = achievements.getUserAchievementData({ noOfCompletedProducts, completed });

      // expectation
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: false,
          completedAmount: noOfCompletedProducts,
          completedPercent: 50,
          totalAmount: achievement.max
        })
      })]));
    });
  });

  describe('timed case', () => {
    beforeEach(() => {
      achievement = {
        id: achievementId,
        group: groups.timed,
        max: 5
      };
      achievements.lib.sortedAchievements.mockReturnValue([achievement]);
    });

    test('completed achievement', () => {
      // setup
      achievements.lib.getPercentageComplete = jest.fn().mockReturnValue(100);
      const noOfConsecutiveDays = 5;
      completed = ['irrelevant'];

      // function under test
      const output = achievements.getUserAchievementData({ noOfConsecutiveDays, completed });

      // expectation
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: true,
          completedAmount: 5,
          completedPercent: 100,
          totalAmount: 5
        })
      })]));
    });

    test('in progress achievement', () => {
      // setup
      achievements.lib.getPercentageComplete = jest.fn().mockReturnValue(75);
      const noOfConsecutiveDays = 4;
      completed = [];

      // function under test
      const output = achievements.getUserAchievementData({ noOfConsecutiveDays, completed });

      // expectation
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: false,
          completedAmount: 4,
          completedPercent: 75,
          totalAmount: 5
        })
      })]));
    });
  });

  describe('settings case', () => {
    beforeEach(() => {
      achievement = {
        id: achievementId,
        group: groups.settings
      };
      achievements.lib.sortedAchievements.mockReturnValue([achievement]);
    });

    test('completed achievement', () => {
      completed = ['irrelevant'];
      const output = achievements.getUserAchievementData({ completed });
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: true,
          completedAmount: 1,
          completedPercent: 100,
          totalAmount: 1
        })
      })]));
    });

    test('incomplete achievement', () => {
      completed = [];
      const output = achievements.getUserAchievementData({ completed });
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: false,
          completedAmount: 0,
          completedPercent: 0,
          totalAmount: 1
        })
      })]));
    });
  });

  describe('proposals case', () => {
    beforeEach(() => {
      achievement = {
        id: achievementId,
        group: groups.proposals,
        max: 2
      };
      achievements.lib.sortedAchievements.mockReturnValue([achievement]);
    });

    test('incomplete achievement with level', () => {
      // setup
      achievement.level = 1;
      achievements.lib.getPercentageComplete = jest.fn().mockReturnValue(100);
      completed = [];

      // function under test
      const output = achievements.getUserAchievementData({
        completed,
        clients: [{
          completed: true,
          level: 1
        }]
      });

      // expectation
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: false,
          completedAmount: 1,
          completedPercent: 100,
          totalAmount: achievement.max
        })
      })]));
    });

    test('complete achievement with all clients', () => {
      // setup
      achievement.allClients = true;
      achievements.lib.getPercentageComplete = jest.fn().mockReturnValue(100);
      completed = ['irrelevant'];

      // function under test
      const output = achievements.getUserAchievementData({
        completed,
        clients: [{
          completed: true,
          level: 1
        }, {
          completed: true,
          level: 1
        }]
      });

      // expectation
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: true,
          completedAmount: achievement.max,
          completedPercent: 100,
          totalAmount: achievement.max
        })
      })]));
    });

    test('complete achievement without max', () => {
      // setup
      delete achievement.max;
      achievements.lib.getPercentageComplete = jest.fn().mockReturnValue(100);
      completed = [achievement.id];

      // function under test
      const output = achievements.getUserAchievementData({ completed });

      // expectation
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: true,
          completedAmount: 1,
          completedPercent: 100,
          totalAmount: 1
        })
      })]));
    });

    test('incomplete achievement without max', () => {
      // setup
      delete achievement.max;
      achievements.lib.getPercentageComplete = jest.fn().mockReturnValue(100);
      completed = [];

      // function under test
      const output = achievements.getUserAchievementData({ completed });

      // expectation
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: false,
          completedAmount: 0,
          completedPercent: 0,
          totalAmount: 1
        })
      })]));
    });
  });

  describe('default case', () => {
    beforeEach(() => {
      achievement = {
        id: achievementId,
        group: 'irrelevant'
      };
      achievements.lib.sortedAchievements.mockReturnValue([achievement]);
    });

    test('completed achievement', () => {
      completed = ['irrelevant'];
      const output = achievements.getUserAchievementData({ completed });
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: true,
          completedAmount: 1,
          completedPercent: 100,
          totalAmount: 1
        })
      })]));
    });

    test('incomplete achievement', () => {
      completed = [];
      const output = achievements.getUserAchievementData({ completed });
      expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
        ...achievement,
        completion: expect.objectContaining({
          complete: false,
          completedAmount: 0,
          completedPercent: 0,
          totalAmount: 1
        })
      })]));
    });
  });
});
