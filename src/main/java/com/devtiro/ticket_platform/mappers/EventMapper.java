package com.devtiro.ticket_platform.mappers;

import com.devtiro.ticket_platform.domain.CreateEventRequest;
import com.devtiro.ticket_platform.domain.CreateTicketTypeRequest;
import com.devtiro.ticket_platform.domain.dtos.*;
import com.devtiro.ticket_platform.domain.entities.Event;
import com.devtiro.ticket_platform.domain.entities.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {

    CreateTicketTypeRequest fromDto(CreateTicketTypeRequestDto dto);

    CreateEventRequest fromDto(CreateEventRequestDto dto);

    CreateEventResponseDto toDto(Event event);
    ListEventTicketTypeResponseDto toDto(TicketType ticketType);

    ListEventResponseDto toListEventResponseDto(Event event);
    GetEventDetailsTicketTypesResponseDto toGetEventDetailsTicketTypesResponseDto(TicketType ticketType);
    GetEventDetailsResponseDto toGetEventDetailsResponseDto(Event event);

}