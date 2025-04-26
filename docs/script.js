import { safeStringify } from 'safe-stringify-ts';

document.addEventListener('DOMContentLoaded', () => {
    // Copy button functionality
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            const codeBlock = document.querySelector(`#${target} code`);
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            });
        });
    });

    // Example runners
    const examples = {
        basic: () => {
            const obj = {
                string: 'Hello World',
                number: 42,
                boolean: true,
                date: new Date(),
                nested: { a: 1, b: 2 }
            };
            return obj;
        },
        circular: () => {
            const obj = { nested: { data: 'value' } };
            obj.self = obj;
            return obj;
        },
        dom: () => {
            return {
                element: document.body,
                windowRef: window,
                otherData: [1, 2, 3]
            };
        },
        async: async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
                return await response.json();
            } catch (error) {
                return { error: 'Failed to fetch data' };
            }
        }
    };

    // Run button functionality
    document.querySelectorAll('.run-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const example = button.getAttribute('data-example');
            const outputElement = document.querySelector(`#${example}Output`);
            
            try {
                const result = await examples[example]();
                outputElement.textContent = safeStringify(result);
                outputElement.classList.add('active');
            } catch (error) {
                outputElement.textContent = `Error: ${error.message}`;
                outputElement.classList.add('active');
            }
        });
    });
});