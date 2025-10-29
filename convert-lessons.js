/**
 * Script to convert mixmind_ch1_lessons_questions.json to curriculum-data.json format
 */

const fs = require('fs');
const path = require('path');

// Read the new lessons file
const newLessons = JSON.parse(fs.readFileSync('/Users/Rhys/Desktop/mixmind_ch1_lessons_questions.json', 'utf8'));

// Read the existing curriculum
const curriculum = JSON.parse(fs.readFileSync('/Users/Rhys/test-project/HomeGameAdvantage/curriculum-data.json', 'utf8'));

// Keep only modules (don't touch them)
const updatedCurriculum = {
  modules: curriculum.modules,
  lessons: [],
  items: []
};

// Remove all ch1-basics lessons from existing curriculum
const existingNonCh1Lessons = curriculum.lessons.filter(l => l.moduleId !== 'ch1-basics');

let itemIdCounter = 1;

// Convert the new lessons
newLessons.forEach((lesson, lessonIndex) => {
  const lessonId = lesson.lesson_id;
  const itemIds = [];
  const types = new Set();

  // Convert each question to an item
  lesson.questions.forEach((q, qIndex) => {
    const itemId = `ch1-${String(itemIdCounter).padStart(3, '0')}`;
    itemIdCounter++;
    itemIds.push(itemId);

    // Convert roleplay to MCQ
    let questionType = q.question_type.toLowerCase();
    if (questionType === 'roleplay') {
      questionType = 'mcq';
    }
    types.add(questionType);

    const item = {
      id: itemId,
      type: questionType,
      prompt: q.question_text,
      tags: [lesson.lesson_id.replace(/_/g, '-'), 'ch1-basics'],
      conceptId: `${lesson.lesson_id}.${qIndex + 1}`,
      difficulty: 0.1 + (qIndex * 0.01),
      xpAward: q.xp_value,
      reviewWeight: 0.7
    };

    // Add type-specific fields
    switch (questionType) {
      case 'mcq':
        item.options = q.options || q.choices;
        const correctAnswer = q.correct_answer;
        item.answerIndex = item.options.indexOf(correctAnswer);
        break;

      case 'checkbox':
        item.options = q.options;
        item.correct = q.correct_answers;
        break;

      case 'short':
        if (q.acceptable_answers && q.acceptable_answers.length > 0) {
          item.answerText = q.acceptable_answers[0];
          item.acceptableAnswers = q.acceptable_answers;
        }
        break;

      case 'order':
        item.orderTarget = q.correct_order;
        break;

      case 'match':
        item.pairs = q.pairs.map(p => ({
          left: p.prompt,
          right: p.match
        }));
        break;
    }

    updatedCurriculum.items.push(item);
  });

  // Create the lesson object
  const lessonObj = {
    id: lessonId.replace(/_/g, '-'),
    moduleId: 'ch1-basics',
    title: lesson.lesson_title,
    types: Array.from(types),
    itemIds: itemIds,
    estimatedMinutes: Math.ceil(lesson.questions.length / 2),
    prereqs: []
  };

  updatedCurriculum.lessons.push(lessonObj);
});

// Add back all non-ch1 lessons
updatedCurriculum.lessons = [...updatedCurriculum.lessons, ...existingNonCh1Lessons];

// Add back all non-ch1 items
const existingNonCh1Items = curriculum.items.filter(item => {
  // Check if this item belongs to any ch1 lesson
  const ch1LessonIds = curriculum.lessons
    .filter(l => l.moduleId === 'ch1-basics')
    .flatMap(l => l.itemIds);
  return !ch1LessonIds.includes(item.id);
});

updatedCurriculum.items = [...updatedCurriculum.items, ...existingNonCh1Items];

// Write the updated curriculum
fs.writeFileSync(
  '/Users/Rhys/test-project/HomeGameAdvantage/curriculum-data.json',
  JSON.stringify(updatedCurriculum, null, 2),
  'utf8'
);

console.log('✅ Conversion complete!');
console.log(`Created ${updatedCurriculum.lessons.filter(l => l.moduleId === 'ch1-basics').length} new ch1-basics lessons`);
console.log(`Created ${updatedCurriculum.items.filter(i => i.id.startsWith('ch1-')).length} new items`);
console.log(`Total lessons: ${updatedCurriculum.lessons.length}`);
console.log(`Total items: ${updatedCurriculum.items.length}`);
