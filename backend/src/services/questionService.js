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
  async generateQuestions(mode, difficulty, count = 10) {
    const questions = [];
    const usedIds = [];
    const division = difficulty === 'easy' ? 'primera' : null;
    const isFamous = difficulty === 'easy';

    if (mode === 'teams') {
      const teams = await questionRepository.getRandomTeams(
        division || '%',
        count,
        []
      );

      for (const team of teams) {
        usedIds.push(team.id);
        const wrongOptions = await questionRepository.getRandomTeamsAsOptions(team.id, 2);
        const options = shuffle([
          { id: team.id, name: team.name, logo_url: team.logo_url, correct: true },
          ...wrongOptions.map(t => ({ id: t.id, name: t.name, logo_url: t.logo_url, correct: false }))
        ]);

        questions.push({
          questionRefId: team.id,
          questionType: 'teams',
          imageUrl: team.logo_url,
          questionText: '¿Qué equipo es este?',
          options
        });
      }
    }

    if (mode === 'players') {
      const players = await questionRepository.getRandomPlayers(isFamous, count, []);

      for (const player of players) {
        usedIds.push(player.id);
        const wrongOptions = await questionRepository.getRandomTeamsAsPlayerOptions(player.team_id, 2);
        const correctTeam = { id: player.team_id, name: player.team_name };
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
    }

    if (mode === 'timed') {
      const teamCount = Math.ceil(count / 2);
      const playerCount = Math.floor(count / 2);

      const teamQuestions = await questionService.generateQuestions('teams', difficulty, teamCount);
      const playerQuestions = await questionService.generateQuestions('players', difficulty, playerCount);

      return shuffle([...teamQuestions, ...playerQuestions]);
    }

    return questions;
  }
};

module.exports = questionService;