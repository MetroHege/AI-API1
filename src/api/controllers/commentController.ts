import {Request, Response, NextFunction} from 'express';
import fetchData from '../../lib/fetchData';
import {ChatCompletion} from 'openai/resources';

const commentPost = async (
  req: Request<{}, {}, {text: string}>,
  res: Response<{response: string}>,
  next: NextFunction
) => {
  try {
    // TODO: Generate a sarcastic, hostile AI response to a Youtube comment, imitating an 18th-century English aristocrat, and return it as a JSON response.
    // Use the text from the request body to generate the response.
    // Instead of using openai library, use fetchData to make a post request to the server.
    // see https://platform.openai.com/docs/api-reference/chat/create for more information
    // You don't need an API key if you use the URL provided in .env.sample and Metropolia VPN
    // Example: instad of https://api.openai.com/v1/chat/completions use process.env.OPENAI_API_URL + '/v1/chat/completions'
    const {text} = req.body;

    // Use the text from the request body to generate the response.
    const response = await fetchData<ChatCompletion>(
      process.env.OPENAI_API_URL + '/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Generate a humorous and playful AI-generated response to a YouTube comment in the style of a quirky, modern character with a flair for over-the-top dramatic reactions. The character should be a tea-obsessed enthusiast, with an exaggerated sense of refinement and a touch of sarcasm. The YouTuber they're responding to has a noticeable Welsh or Irish accent, owns thirty sheep, and frequently talks about them on their channel. The AI's reply should be amusing, teasing the YouTuber's sheep obsession while staying lighthearted and fun. The tone should be energetic, whimsical, and slightly tongue-in-cheek, without being too formal or old-fashioned.`,
            },
            {
              role: 'user',
              content: text,
            },
          ],
        }),
      }
    );
    if (!response.choices || !response.choices[0].message.content) {
      throw new Error('No response from OpenAI');
    }

    res.json({response: response.choices[0].message.content});
  } catch (error) {
    next(error);
  }
};

export {commentPost};
