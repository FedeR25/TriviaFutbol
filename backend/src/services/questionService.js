const questionRepository = require('../repositories/questionRepository');

const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const questionService = {
  async generateQuestions(mode, count = 10) {

    if (mode === 'timed') {
      const teamCount = Math.ceil(count / 2);
      const playerCount = Math.floor(count / 2);
      const teamQuestions = await questionService.generateQuestions('teams', teamCount);
      const playerQuestions = await questionService.generateQuestions('players', playerCount);
      return shuffle([...teamQuestions, ...playerQuestions]);
    }

    if (mode === 'teams') {
      const teams = await questionRepository.getRandomTeams(count);
      const questions = [];

      for (const team of teams) {
        let wrongOptions = await questionRepository.getWrongTeamOptions(team.id, team.league, team.division, 2);

        if (wrongOptions.length < 2) {
          const extra = await questionRepository.getWrongTeamOptionsFallback(team.id, team.country, 2 - wrongOptions.length);
          wrongOptions = [...wrongOptions, ...extra];
        }

        if (wrongOptions.length < 2) continue;

        const options = shuffle([
          { id: team.id, name: team.name, correct: true },
          ...wrongOptions.map(t => ({ id: t.id, name: t.name, correct: false }))
        ]);

        questions.push({
          questionRefId: team.id,
          questionType: 'teams',
          imageUrl: team.logo_url,
          questionText: '¿Qué equipo es este?',
          options
        });
      }

      return questions;
    }

    if (mode === 'players') {
      const players = await questionRepository.getRandomPlayers(count);
      const questions = [];

      for (const player of players) {
        let wrongOptions = await questionRepository.getWrongTeamOptions(player.team_id, player.league, player.division, 2);

        if (wrongOptions.length < 2) {
          const extra = await questionRepository.getWrongTeamOptionsFallback(player.team_id, player.country, 2 - wrongOptions.length);
          wrongOptions = [...wrongOptions, ...extra];
        }

        if (wrongOptions.length < 2) continue;

        const options = shuffle([
          { id: player.team_id, name: player.team_name, correct: true },
          ...wrongOptions.map(t => ({ id: t.id, name: t.name, correct: false }))
        ]);

        questions.push({
          questionRefId: player.id,
          questionType: 'players',
          imageUrl: player.photo_url,
          questionText: `¿En qué equipo juega ${player.name}?`,
          options
        });
      }

      return questions;
    }

    return [];
  }
};

module.exports = questionService;