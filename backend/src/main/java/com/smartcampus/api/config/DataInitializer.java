package com.smartcampus.api.config;

import com.smartcampus.api.entity.*;
import com.smartcampus.api.repository.BookingRepository;
import com.smartcampus.api.repository.NotificationRepository;
import com.smartcampus.api.repository.ResourceRepository;
import com.smartcampus.api.repository.TicketRepository;
import com.smartcampus.api.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
@Profile({"h2", "postgres"})
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final TicketRepository ticketRepository;
    private final BookingRepository bookingRepository;
    private final NotificationRepository notificationRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            ResourceRepository resourceRepository,
            TicketRepository ticketRepository,
            BookingRepository bookingRepository,
            NotificationRepository notificationRepository,
            BCryptPasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
        this.ticketRepository = ticketRepository;
        this.bookingRepository = bookingRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        User admin = upsertUser(
                "admin@smartcampus.local",
                "Admin",
                "User",
                "local-admin",
                "admin123",
                UserRole.ADMIN
        );

        User student = upsertUser(
                "student@smartcampus.local",
                "Student",
                "User",
                "local-student",
                "student123",
                UserRole.STUDENT
        );

        User technician = upsertUser(
                "tech@smartcampus.local",
                "Tech",
                "Support",
                "local-tech",
                "tech123",
                UserRole.TECHNICIAN
        );

        Resource lectureHall = upsertResource(
                "Main Lecture Hall",
                "Large lecture hall with projector and seating for classes.",
                ResourceType.LECTURE_HALL,
                "Block A, Floor 1",
                120,
                25.0,
                "Projector,AC,Whiteboard",
                "MONDAY-FRIDAY",
                LocalTime.of(8, 0),
                LocalTime.of(18, 0),
                "https://images.unsplash.com/photo-1503676260728-1c00da094a0b"
        );

        Resource lab = upsertResource(
                "Computer Lab 2",
                "Student computer lab with workstations and network access.",
                ResourceType.LAB,
                "Block B, Floor 2",
                40,
                30.0,
                "PCs,AC,Internet",
                "MONDAY-SATURDAY",
                LocalTime.of(9, 0),
                LocalTime.of(17, 0),
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
        );

        Resource auditorium = upsertResource(
                "Campus Auditorium",
                "Auditorium for events, talks and large gatherings.",
                ResourceType.AUDITORIUM,
                "Main Building, Ground Floor",
                250,
                50.0,
                "Stage,Sound System,Projector",
                "MONDAY-SUNDAY",
                LocalTime.of(8, 0),
                LocalTime.of(20, 0),
                "https://images.unsplash.com/photo-1501386761578-eac5c94b800a"
        );

        Ticket ticket1 = upsertTicket(
                "Projector not working",
                "The projector in Lab 2 does not display the screen.",
                student,
                technician.getEmail(),
                TicketStatus.OPEN,
                TicketPriority.HIGH,
                TicketCategory.TECHNICAL
        );

        upsertTicket(
                "Air conditioning maintenance",
                "Lecture Hall AC is noisy and needs inspection.",
                student,
                technician.getEmail(),
                TicketStatus.IN_PROGRESS,
                TicketPriority.MEDIUM,
                TicketCategory.MAINTENANCE
        );

        Ticket ticket3 = upsertTicket(
                "Billing clarification",
                "Need clarification about resource booking charges.",
                student,
                null,
                TicketStatus.OPEN,
                TicketPriority.LOW,
                TicketCategory.BILLING
        );

        Booking booking1 = upsertBooking(
                student,
                lectureHall,
                LocalDate.now().plusDays(1),
                LocalTime.of(10, 0),
                LocalTime.of(12, 0),
                "Guest lecture",
                BookingStatus.PENDING,
                50.0
        );

        upsertBooking(
                student,
                auditorium,
                LocalDate.now().plusDays(2),
                LocalTime.of(14, 0),
                LocalTime.of(16, 0),
                "Student presentation",
                BookingStatus.APPROVED,
                100.0
        );

        upsertNotification(
                student,
                "Booking pending",
                "Your lecture hall booking is awaiting approval.",
                NotificationType.BOOKING_APPROVED,
                String.valueOf(booking1.getId())
        );

        upsertNotification(
                student,
                "Ticket assigned",
                "Your technical ticket has been assigned to support staff.",
                NotificationType.TICKET_STATUS_CHANGED,
                String.valueOf(ticket1.getId())
        );

        upsertNotification(
                admin,
                "New ticket created",
                "A new support ticket is available for review.",
                NotificationType.TICKET_CREATED,
                String.valueOf(ticket3.getId())
        );
    }

    private User upsertUser(
            String email,
            String firstName,
            String lastName,
            String googleId,
            String password,
            UserRole role
    ) {
        User user = userRepository.findByEmail(email).orElseGet(User::new);

        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setGoogleId(googleId);

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(password));
        }

        user.setRole(role);
        user.setActive(true);

        return userRepository.save(user);
    }

    private Resource upsertResource(
            String name,
            String description,
            ResourceType type,
            String location,
            int capacity,
            double pricePerHour,
            String amenities,
            String availableDays,
            LocalTime availableFrom,
            LocalTime availableTo,
            String imageUrl
    ) {
        Resource resource = resourceRepository.findAll().stream()
                .filter(existing -> name.equals(existing.getName()))
                .findFirst()
                .orElseGet(Resource::new);

        resource.setName(name);
        resource.setDescription(description);
        resource.setType(type);
        resource.setLocation(location);
        resource.setCapacity(capacity);
        resource.setPricePerHour(pricePerHour);
        resource.setAmenities(amenities);
        resource.setAvailable(true);
        resource.setAvailableDays(availableDays);
        resource.setAvailableFrom(availableFrom);
        resource.setAvailableTo(availableTo);
        resource.setImageUrl(imageUrl);

        return resourceRepository.save(resource);
    }

    private Ticket upsertTicket(
            String title,
            String description,
            User creator,
            String assignedTo,
            TicketStatus status,
            TicketPriority priority,
            TicketCategory category
    ) {
        Ticket ticket = ticketRepository.findAll().stream()
                .filter(existing -> title.equals(existing.getTitle()))
                .findFirst()
                .orElseGet(Ticket::new);

        ticket.setTitle(title);
        ticket.setDescription(description);
        ticket.setCreator(creator);
        ticket.setAssignedTo(assignedTo);
        ticket.setStatus(status);
        ticket.setPriority(priority);
        ticket.setCategory(category);

        return ticketRepository.save(ticket);
    }

    private Booking upsertBooking(
            User user,
            Resource resource,
            LocalDate bookingDate,
            LocalTime startTime,
            LocalTime endTime,
            String purpose,
            BookingStatus status,
            double totalPrice
    ) {
        Long userId = user.getId();
        Long resourceId = resource.getId();

        Booking booking = bookingRepository.findAll().stream()
                .filter(existing -> existing.getUser() != null
                        && existing.getResource() != null
                        && existing.getUser().getId().equals(userId)
                        && existing.getResource().getId().equals(resourceId)
                        && bookingDate.equals(existing.getBookingDate())
                        && purpose.equals(existing.getPurpose()))
                .findFirst()
                .orElseGet(Booking::new);

        booking.setUser(user);
        booking.setResource(resource);
        booking.setBookingDate(bookingDate);
        booking.setStartTime(LocalDateTime.of(bookingDate, startTime));
        booking.setEndTime(LocalDateTime.of(bookingDate, endTime));
        booking.setPurpose(purpose);
        booking.setStatus(status);
        booking.setTotalPrice(totalPrice);

        return bookingRepository.save(booking);
    }

    private Notification upsertNotification(
            User user,
            String title,
            String message,
            NotificationType type,
            String relatedResourceId
    ) {
        Notification notification = notificationRepository.findAll().stream()
                .filter(existing -> title.equals(existing.getTitle())
                        && message.equals(existing.getMessage()))
                .findFirst()
                .orElseGet(Notification::new);

        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);
        notification.setRelatedResourceId(relatedResourceId);

        return notificationRepository.save(notification);
    }
}