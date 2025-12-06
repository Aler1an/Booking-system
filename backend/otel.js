import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { detectResources } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

async function setupOpenTelemetry() {

const resource = await detectResources();

const sdk = new NodeSDK({
    resource,
    traceExporter: undefined,
    instrumentations: [getNodeAutoInstrumentations()],
});

await sdk.start();
console.log('OpenTelemetry SDK запущено!');
}

setupOpenTelemetry().catch((error) => {
console.error('Помилка при старті OpenTelemetry:', error);
});
