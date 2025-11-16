import type { Section } from './types';

const BASE_PROMPT = "Act as a world-class content strategist and UI/UX designer crafting a page for a premium, modern website about IBM Watson. Your goal is to generate content that is not only informative but also visually stunning when rendered. For the given topic, create a comprehensive and engaging overview using rich Markdown formatting. Structure the content with a clear visual hierarchy. Use the following elements creatively:\n\n- **Headings (`##`, `###`):** For clear section breaks.\n- **Bold (`**text**`) and Italics (`*text*`):** For emphasis on key terms.\n- **Unordered Lists (`-`):** For scannable points. Use nested lists for sub-points where appropriate.\n- **Blockquotes (`>`):** To highlight key insights, facts, or quotes. Start these with a bolded label like `> **Key Takeaway:**` or `> **Did You Know?:**` to allow for special styling.\n- **Tables:** Use tables to compare features or present structured data clearly.\n- **Code Blocks (```):** For any technical snippets, APIs, or commands.\n\nThe response MUST be in Markdown format. Your tone should be expert, yet clear and accessible. The topic is:";

export const SECTIONS: Section[] = [
  {
    id: 'what-is-watson',
    title: 'What is Watson?',
    prompt: `${BASE_PROMPT} "What is IBM Watson?". Start with its origins, specifically covering the DeepQA project and the development of the Watson computer system. Detail its key milestone victory in the Jeopardy! challenge. After describing the victory, include the placeholder \`[WATSON_JEOPARDY_IMAGE]\`. Where appropriate in the narrative, also include the placeholder \`[TIMELINE_COMPONENT]\` to indicate where an interactive historical timeline should be rendered. Then, explain its evolution from a game show champion into a commercial AI platform, and describe its core mission in the enterprise world today.`
  },
  {
    id: 'key-capabilities',
    title: 'Key Capabilities',
    prompt: `${BASE_PROMPT} "The Key Capabilities of IBM Watson". Detail its abilities in areas like Natural Language Processing (NLP), Machine Learning, Automated Visual Recognition, Tone Analysis, and Explainable AI. Provide brief examples for each. After the descriptions, include the placeholder \`[VIDEO_SHOWCASE]\` to indicate where an interactive video showcase should be rendered.`
  },
  {
    id: 'watsonx-platform',
    title: 'The Watsonx Platform',
    prompt: `${BASE_PROMPT} "The IBM Watsonx Platform". Explain what Watsonx is. After the main introduction, include the placeholder \`[WATSONX_PLATFORM_IMAGE]\`. Then, detail its three core components (watsonx.ai, watsonx.data, watsonx.governance), and how it helps businesses scale AI with trust and transparency.`
  },
  {
    id: 'products-services',
    title: 'Products & Services',
    prompt: `${BASE_PROMPT} "Key IBM Watson Products and Services". Describe flagship products like Watson Assistant for conversational AI, Watson Discovery for enterprise search, and Watson Studio for data science workflows. Explain the primary use case for each.`
  },
  {
    id: 'use-cases',
    title: 'Industry Use Cases',
    prompt: `${BASE_PROMPT} "Industry Use Cases for IBM Watson". Provide detailed examples of how Watson is applied in various sectors such as Healthcare (medical imaging, drug discovery), Finance (risk management, compliance), and Customer Service (chatbots, personalization).`
  },
  {
    id: 'developer-resources',
    title: 'Developer Resources',
    prompt: `${BASE_PROMPT} "Resources for Developers using IBM Watson". List and briefly describe the resources available to developers, including APIs, SDKs (mentioning popular languages like Python, Node.js), documentation portals, and the IBM Cloud ecosystem. After the overview, include the placeholder \`[CODE_SNIPPET]\` to indicate where an interactive 'Hello Watson' code example should be rendered.`
  }
];