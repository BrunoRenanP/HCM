package brunorenanpichdev.com.hcm.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final RabbitTemplate rabbitTemplate;

    public void requestReportGeneration() {
        try {
            rabbitTemplate.convertAndSend("reportExchange", "reportRoutingKey", "Generate CSV Report");
            log.info("Mensagem de geração de relatório enviada com sucesso");
        } catch (Exception e) {
            log.error("Erro ao enviar mensagem para o RabbitMQ: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao enviar solicitação de geração de relatório", e);
        }
    }
}
