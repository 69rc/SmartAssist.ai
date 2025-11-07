// Reference: javascript_openai blueprint
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface DiagnosisRequest {
  issue: string;
  applianceType?: string;
  brand?: string;
  model?: string;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface DiagnosisResponse {
  diagnosis: string;
  solution: string;
  conversationResponse: string;
}

export async function diagnoseIssue(request: DiagnosisRequest): Promise<DiagnosisResponse> {
  try {
    const systemPrompt = `You are an expert appliance repair technician with decades of experience diagnosing and fixing home electronics and appliances. 

Your role is to:
1. Ask clarifying questions to understand the exact issue
2. Provide step-by-step troubleshooting instructions
3. Identify likely causes and solutions
4. Recommend when professional help is needed

Be conversational, helpful, and specific. Use simple language that homeowners can understand. When providing steps, number them clearly.`;

    const userPrompt = `Appliance: ${request.applianceType || 'Unknown'}
Brand: ${request.brand || 'Unknown'}
Model: ${request.model || 'Unknown'}

Issue: ${request.issue}

Please help diagnose this problem and provide troubleshooting guidance.`;

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt }
    ];

    if (request.conversationHistory && request.conversationHistory.length > 0) {
      messages.push(...request.conversationHistory);
    }

    messages.push({ role: "user", content: userPrompt });

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages,
      max_tokens: 2048,
    });

    const aiResponse = response.choices[0].message.content || "";

    return {
      diagnosis: aiResponse,
      solution: aiResponse,
      conversationResponse: aiResponse,
    };
  } catch (error: any) {
    throw new Error("Failed to get AI diagnosis: " + error.message);
  }
}

export interface ImageAnalysisRequest {
  base64Image: string;
  applianceType?: string;
  userDescription?: string;
}

export interface ImageAnalysisResponse {
  analysis: string;
  identifiedIssues: string[];
  recommendations: string;
}

export async function analyzeApplianceImage(request: ImageAnalysisRequest): Promise<ImageAnalysisResponse> {
  try {
    const prompt = `You are an expert appliance repair technician analyzing an image of a ${request.applianceType || 'home appliance'}.

User's description: ${request.userDescription || 'No description provided'}

Please analyze this image and provide:
1. What you see in the image (error codes, visible damage, parts)
2. Potential issues or problems identified
3. Recommended next steps or solutions

Be specific and actionable. If you see error codes, explain what they mean.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${request.base64Image}`
              }
            }
          ],
        },
      ],
      max_tokens: 2048,
    });

    const analysisText = response.choices[0].message.content || "";

    // Extract potential issues from the analysis
    const issues: string[] = [];
    if (analysisText.toLowerCase().includes('error code')) {
      issues.push('Error code detected');
    }
    if (analysisText.toLowerCase().includes('damage')) {
      issues.push('Visible damage');
    }
    if (analysisText.toLowerCase().includes('leak')) {
      issues.push('Potential leak');
    }

    return {
      analysis: analysisText,
      identifiedIssues: issues,
      recommendations: analysisText,
    };
  } catch (error: any) {
    throw new Error("Failed to analyze image: " + error.message);
  }
}
