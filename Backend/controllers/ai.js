import AI from "../services/ai.js";


function parseJsonFromModelText(rawText) {

    if (!rawText) {

        throw new Error(
            "Empty AI response"
        );
    }

    const trimmed = rawText.trim();

    try {

        return JSON.parse(trimmed);

    } catch {

        const fenceMatch =
            trimmed.match(
                /```(?:json)?\s*([\s\S]*?)\s*```/i
            );

        if (fenceMatch?.[1]) {

            return JSON.parse(
                fenceMatch[1]
            );
        }
    }

    throw new Error(
        "AI response is not valid JSON"
    );
}


// ===== VALIDATE QUESTIONS =====
function normalizeAndValidateQuestions(
    data,
    subject,
    topic
) {

    if (!Array.isArray(data)) {

        throw new Error(
            "AI response must be an array"
        );
    }

    return data

        .map((item) => ({

            questionText:
                String(
                    item.questionText ||
                    item.question ||
                    ""
                ).trim(),

            options:
                Array.isArray(item.options)
                    ? item.options
                        .map((opt) =>
                            String(opt ?? "").trim()
                        )
                        .slice(0, 4)
                    : [],

            correctOption:
                Number(item.correctOption),

            difficulty:
                String(
                    item.difficulty || ""
                )
                    .toLowerCase()
                    .trim(),

            subject,

            // ===== TOPIC =====
            topic,
        }))

        .filter(
            (q) =>

                q.questionText &&

                q.options.length === 4 &&

                q.options.every(
                    (opt) => opt
                ) &&

                Number.isInteger(
                    q.correctOption
                ) &&

                q.correctOption >= 0 &&

                q.correctOption <= 3 &&

                ["easy", "medium", "hard"]
                    .includes(q.difficulty)
        );
}


// ===== MAIN CONTROLLER =====
export async function generateAIQuestions(
    req,
    res
) {

    try {

        const {
            subject,
            topic
        } = req.query;

        if (!subject || !topic) {

            return res.status(400).json({

                error:
                    "subject and topic are required"
            });
        }

        // ===== CALL AI =====
        const rawResponse =
            await AI({
                subject,
                topic
            });

        const parsed =
            parseJsonFromModelText(
                rawResponse
            );

        const questions =
            normalizeAndValidateQuestions(
                parsed,
                subject,
                topic
            );

        if (!questions.length) {

            return res.status(422).json({

                error:
                    "AI generated no valid questions. Please try again."
            });
        }

        res.json({

            message:
                "Questions generated successfully",

            questions,
        });

    } catch (error) {

        console.error(
            "Error generating AI questions:",
            error
        );

        res.status(500).json({

            error:
                "Failed to generate questions"
        });
    }
}