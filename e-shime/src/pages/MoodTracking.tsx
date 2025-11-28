import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { API_BASE } from '../lib/config';

interface MoodTrackingProps {
  darkMode: boolean;
}

const moods = [
  { emoji: '😊', label: 'Happy', value: 5, color: '#10b981' },
  { emoji: '😌', label: 'Calm', value: 4, color: '#3b82f6' },
  { emoji: '😐', label: 'Neutral', value: 3, color: '#fbbf24' },
  { emoji: '😔', label: 'Sad', value: 2, color: '#f97316' },
  { emoji: '😰', label: 'Anxious', value: 1, color: '#ef4444' },
];

interface MoodProps {
  id: number;
  mood_value: number;
  mood_label: string;
  journal_note: string | null;
  created_at: string;
}

export function MoodTracking({ darkMode }: MoodTrackingProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [journalNote, setJournalNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [moodData, setMoodData] = useState<any[]>([]);

  const userId = localStorage.getItem('user_Id') ?? '';

  // 🟢 Fetch Mood Logs From Backend
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${API_BASE}/api/mood/getMoodLogs`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            userid: userId,
          },
        });

        const data = await response.json();
        console.log('Fetched Logs:', data);

        // Convert DB rows → graph format
        const formatted = (data.rows || []).map((item: MoodProps) => ({
          date: new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          mood: item.mood_value,
        }));

        setMoodData(formatted);
      } catch (e) {
        console.error('Fetch error:', e);
      }
    })();
  }, [userId]);

  // 🟢 Submit Mood Log
  const handleSubmit = async () => {
    if (!selectedMood) return;

    const moodObj = moods.find(m => m.value === selectedMood);
    if (!moodObj) return;

    try {
      const response = await fetch(`${API_BASE}/api/mood/postMoodLogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
          userid: userId,
          mood_value: moodObj.value,
          mood_label: moodObj.label,
          journal_note: journalNote || null,
        }),
      });

      const data = await response.json();
      console.log('Mood logged:', data);

      // UI animation
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setSelectedMood(null);
        setJournalNote('');
      }, 3000);
    } catch (err) {
      console.error('Error submitting mood:', err);
    }
  };

  

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900' : 'bg-[#F5F5DC]'
      } transition-colors duration-300 pb-20`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`${darkMode ? 'text-white' : 'text-black'} mb-2`}>
            Mood Tracker
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Track your emotional journey and identify patterns
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side: Mood Logger */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              className={`${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
              } p-6`}
            >
              <div className="flex items-center gap-2 mb-6">
                <Calendar
                  className={`h-6 w-6 ${
                    darkMode ? 'text-beige' : 'text-black'
                  }`}
                />
                <h2 className={darkMode ? 'text-white' : 'text-black'}>
                  How are you feeling today?
                </h2>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`text-center py-12 ${
                    darkMode ? 'bg-gray-700' : 'bg-green-50'
                  } rounded-xl`}
                >
                  <Heart
                    className={`h-16 w-16 mx-auto mb-4 ${
                      darkMode ? 'text-beige' : 'text-green-500'
                    }`}
                  />
                  <h3
                    className={`${darkMode ? 'text-white' : 'text-black'} mb-2`}
                  >
                    Mood Logged!
                  </h3>
                  <p
                    className={`${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    Thank you for sharing how you feel
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Mood Emoji Buttons */}
                  <div className="grid grid-cols-5 gap-3 mb-6">
                    {moods.map(mood => (
                      <motion.button
                        key={mood.value}
                        onClick={() => setSelectedMood(mood.value)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                          selectedMood === mood.value
                            ? darkMode
                              ? 'bg-gray-700 ring-2 ring-beige'
                              : 'bg-gray-100 ring-2 ring-black'
                            : darkMode
                            ? 'bg-gray-700/50 hover:bg-gray-700'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-3xl">{mood.emoji}</span>
                        <span
                          className={`text-xs ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {mood.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Journal Note */}
                  <div className="mb-6">
                    <label
                      className={`block mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Journal Note (Optional)
                    </label>
                    <Textarea
                      value={journalNote}
                      onChange={e => setJournalNote(e.target.value)}
                      placeholder="What's on your mind? How are you feeling?"
                      rows={4}
                      className={
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50'
                      }
                    />
                    <p
                      className={`text-xs mt-2 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Your notes are private and only visible to you
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={selectedMood === null}
                    className={`w-full ${
                      darkMode
                        ? 'bg-beige text-black hover:bg-beige/90'
                        : 'bg-black text-white hover:bg-black/90'
                    }`}
                  >
                    Log Mood
                  </Button>
                </>
              )}
            </Card>

            {/* Tips Section */}
          </motion.div>

          {/* Right Side: Mood Graph */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              className={`${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
              } p-6`}
            >
              <h2 className={`${darkMode ? 'text-white' : 'text-black'} mb-6`}>
                Your Mood Over Time
              </h2>

              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={darkMode ? '#374151' : '#e5e7eb'}
                    />
                    <XAxis
                      dataKey="date"
                      stroke={darkMode ? '#9ca3af' : '#6b7280'}
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      domain={[0, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      stroke={darkMode ? '#9ca3af' : '#6b7280'}
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        color: darkMode ? '#ffffff' : '#000000',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Mood Legend */}
              <div className="space-y-2">
                {moods
                  .slice()
                  .reverse()
                  .map(mood => (
                    <div key={mood.value} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: mood.color }}
                      />
                      <span
                        className={darkMode ? 'text-gray-300' : 'text-gray-700'}
                      >
                        {mood.value} - {mood.label} {mood.emoji}
                      </span>
                    </div>
                  ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
