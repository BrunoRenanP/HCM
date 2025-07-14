package brunorenanpichdev.com.hcm.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

@MappedSuperclass
@AllArgsConstructor
@NoArgsConstructor
@Data
@SuperBuilder
public abstract class BaseEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "insertTimestamp", nullable = false)
    private LocalDateTime insertTimestamp = LocalDateTime.now();

    @Column(name = "deleteTimestamp", nullable = true)
    private LocalDateTime deleteTimestamp;

    @PrePersist
    public void prePersist() {
        if (insertTimestamp == null) {
            insertTimestamp = LocalDateTime.now();
        }
    }

}
