package brunorenanpichdev.com.hcm.service;

import brunorenanpichdev.com.hcm.model.dto.AddressDTO;
import brunorenanpichdev.com.hcm.model.dto.UserDTO;
import brunorenanpichdev.com.hcm.model.User;
import brunorenanpichdev.com.hcm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportGeneratorService {

    private final UserRepository userRepository;

    @RabbitListener(queues = "reportQueue")
    @Transactional
    public void generateReport(String message) {
        List<UserDTO> userDTOs = userRepository.findAllWithAddress().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        writeCsv(userDTOs);
    }

    private UserDTO toDTO(User user) {
        AddressDTO addressDTO = AddressDTO.builder()
                .id(user.getAddress().getId())
                .street(user.getAddress().getStreet())
                .numberHouse(user.getAddress().getNumberHouse())
                .city(user.getAddress().getCity())
                .state(user.getAddress().getState())
                .neighborhood(user.getAddress().getNeighborhood())
                .zipCode(user.getAddress().getZipCode())
                .build();

        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .cpf(user.getCpf())
                .cellPhone(user.getCellPhone())
                .address(addressDTO)
                .build();
    }

    private void writeCsv(List<UserDTO> users) {
        try (FileWriter writer = new FileWriter("user_report.csv")) {
            writer.append("ID,Name,CPF,CellPhone,Street,NumberHouse,City,State,Neighborhood,ZipCode\n");
            for (UserDTO user : users) {
                AddressDTO address = user.getAddress();
                writer.append(String.join(",",
                                user.getId().toString(),
                                user.getName(),
                                user.getCpf(),
                                user.getCellPhone(),
                                address != null ? address.getStreet() : "",
                                address != null ? address.getNumberHouse() : "",
                                address != null ? address.getCity() : "",
                                address != null ? address.getState() : "",
                                address != null ? address.getNeighborhood() : "",
                                address != null ? address.getZipCode() : ""))
                        .append("\n");
            }
        } catch (IOException e) {
            throw new RuntimeException("Erro ao escrever o relatório CSV", e);
        }
    }
}
