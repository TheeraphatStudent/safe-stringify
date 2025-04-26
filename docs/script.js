document.addEventListener('DOMContentLoaded', () => {
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

    const safeStringify = (obj) => {
        const getType = (value) => {
            if (value === null) return 'null';
            if (typeof window !== 'undefined' && value === window) return 'window';
            if (typeof Node !== 'undefined' && value instanceof Node) return 'node';
            if (value instanceof Error) return 'error';
            if (value instanceof Date) return 'date';
            if (value instanceof RegExp) return 'regexp';
            if (Array.isArray(value)) return 'array';
            return typeof value;
        };

        const getStringValue = (value, type) => {
            const typeHandlers = {
                undefined: () => 'undefined',
                function: (v) => `[Function: ${v.name || 'anonymous'}]`,
                symbol: (v) => v.toString(),
                node: (v) => `[${v.nodeName || 'Node'}]`,
                error: (v) => `${v.name}: ${v.message}\n${v.stack}`,
                date: (v) => v.toISOString(),
                regexp: (v) => v.toString(),
                window: () => '[Window]',
                bigint: (v) => v.toString(),
                number: (v) => (isNaN(v) ? 'NaN' : v),
            };

            return typeHandlers[type] ? typeHandlers[type](value) : value;
        };

        const seen = new WeakSet();
        const processValue = (value) => {
            const type = getType(value);

            if (type === 'object' || type === 'array') {
                if (seen.has(value)) return '[Circular]';
                seen.add(value);

                const result = type === 'array' ? [] : {};
                for (const key in value) {
                    try {
                        result[key] = processValue(value[key]);
                    } catch (err) {
                        result[key] = `[Error extracting property: ${err.message}]`;
                    }
                }
                return result;
            }

            return getStringValue(value, type);
        };

        try {
            return JSON.stringify(processValue(obj), null, 2);
        } catch (err) {
            return `[Stringify Error: ${err.message}]`;
        }
    };

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